+++
date = '2025-09-28'
draft = false
title = 'Unit of Work: Your best friend in the Repository Pattern'
toc = true
math = true
+++

I use the [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html) in almost every large service I build with Golang, usually divided into Services and Repositories. The Service layer handles the logic, and the Repository handles the database calls, but I always struggle with two main issues: handling transactions and the overhead of creating multiple repositories and injecting them into the service. Unit of Work solves both.

*I'll use GORM to illustrate database management.*

## About Unit of Work

The Unit of Work is a design pattern that aids in transaction and concurrency management. It maintains a list of objects affected by a business transaction and coordinates the writing of changes. In simpler terms, it groups a set of operations into a single atomic unit. If any of the operations fail, all of them are rolled back, ensuring data integrity.

This pattern is particularly useful when working with the Repository Pattern, as it can abstract transaction management from the service layer, making the code cleaner and less error-prone. It also acts as a factory for your repositories, simplifying dependency injection.

Here is a simple implementation of the Unit of Work pattern:


```go
type StoreFactory interface {
	Products() ProductRepository
	Inventories() InventoryRepository
}

type UnitOfWork interface {
	ExecuteTx(fn func(StoreFactory) error) error
	Products() ProductRepository
	Inventories() InventoryRepository
}

type unitOfWork struct {
	db *gorm.DB
}

type storeFactory struct {
	db *gorm.DB
}

func NewUnitOfWork(db *gorm.DB) UnitOfWork {
	return &unitOfWork{db: db}
}

// Execute with transaction
func (r *unitOfWork) ExecuteTx(fn func(StoreFactory) error) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		storeWithTx := &storeFactory{db: tx}
		return fn(storeWithTx)
	})
}

// Without transaction
func (r *unitOfWork) Products() ProductRepository {
	return NewProductRepository(r.db) // From your product repository
}

func (r *unitOfWork) Inventories() InventoryRepository {
	return NewInventoryRepository(r.db) // From your inventory repository
}

// With transaction
func (r *storeFactory) Products() ProductRepository {
	return NewProductRepository(r.db) // From your product repository
}

func (r *storeFactory) Inventories() InventoryRepository {
	return NewInventoryRepository(r.db) // From your inventory repository
}
```

## The problem with transactions

Typically, you create queries on resources and orchestrate them in the service layer, but how do you ensure atomicity throughout the execution? Usually, you use transactions, but how can I tell my repository to start a transaction and close it after a few calls? The obvious solution is to start the transaction in the service layer, pass it to the repository, have the repository use your transaction, and then return an error to roll back if something goes wrong.

You may have noticed that this seems like a huge mess. You have to handle everything manually, which isn't ideal if you have to do this everywhere. Eventually, you'll make a mistake and everything will go wrong. What if you need to refactor something? You'll probably need a pay raise for that.

### The bad solution

You could argue about passing the transaction gorm instance to repositories, and the service handles the database instance, like this:

```go
type ProductRepository struct{}

func (r *ProductRepository) Create(tx *gorm.DB, productName string) error {
	return tx.Exec("INSERT INTO products (name) VALUES (?)", productName).Error
}

type InventoryRepository struct{}

func (r *InventoryRepository) UpdateStock(tx *gorm.DB, productName string, quantity int) error {
	return tx.Exec("INSERT INTO inventory (product_name, quantity) VALUES (?, ?)", productName, quantity).Error
}

type ProductService struct {
	db            *gorm.DB
	productRepo   *ProductRepository
	inventoryRepo *InventoryRepository
}

func (s *ProductService) CreateProductWithStock(productName string, quantity int) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.productRepo.Create(tx, productName); err != nil {
			return err // GORM does automatic rollback if it fails
		}

		if err := s.inventoryRepo.UpdateStock(tx, productName, quantity); err != nil {
			return err // GORM does automatic rollback if it fails
		}

		// if any error occurs, GORM commits.
		return nil
	})
}
```

Managing a transaction is now easy, but you've broken the most important point of this layering pattern: now your service needs to manipulate your database instance, and your repositories are dumb. You've solved one problem by creating another.

### The good solution

With Unit of Work, this is extremely easy. You just need to add our implementation before that handles transaction exchanges. You don't need to change anything in your repositories.

See how easy it is to perform transactions in your service layer now:

```go
type ProductService struct {
	uow repositories.UnitOfWork
}

func (s *ProductService) CreateProductWithStock(productName string, quantity int) error {
	return s.uow.ExecuteTx(func(store repositories.StoreFactory) error {
		productRepo := store.Products()
		inventoryRepo := store.Inventories()

		if err := productRepo.Create(productName); err != nil {
			return err
		}

		if err := inventoryRepo.UpdateStock(productName, quantity); err != nil {
			return err
		}

		return nil
	})
}
```

Now you don't break layers with wrong responsibilities and can handle transactions as if they were trivial.

## The problem of creating a lot of repositories

Another problem arises when you need to pass multiple repositories to multiple services. Imagine you have repositories A, B, and C, and you need to pass them to services A and B. 

This requires a lot of useless lines of code, and when you change something, you'll likely encounter a compilation error because you forgot to pass repository Z to service X.

### The bad solution

Without the Unit of Work you will probably handle like this

```go
db, _ := gorm.Open(sqlite.Open("example.db"), &gorm.Config{})

// creating repos
userRepo := NewUserRepository(db)
orderRepo := NewOrderRepository(db)

// injecting
service := &OrderService{
    userRepo:  userRepo,
    orderRepo: orderRepo,
}
```

Now imagine if you had 20 repositories and 10 services. I'm dizzy just thinking about it.

### The good solution

With Unit of Work, no matter how many repositories or services you have, things stay smaller.

```go
db, _ := gorm.Open(sqlite.Open("example.db"), &gorm.Config{})

// creating just uow repo
uowRepository := repositories.NewUnitOfWork(db)

// injecting just the same singleton
orderService := services.NewInventoryService(uowRepository)
productService := services.NewProductService(uowRepository)
userService := services.NewUserService(uowRepository)
```

Because in your service you can access all your repositories with the Unit of Work

```go
type OrderService struct {
    uow repositories.UnitOfWork
}

func (s *OrderService) DoSomething() {
    s.uow.Orders().CallYourRepoFunctions()
}
```

## Final notes

I hope the examples have been clear and that this helps you solve problems in your day to day life. I discovered this pattern some time ago in its "Golang version", where it goes a little outside the initial scope of the pattern but serves the same purpose.

If you have any improvements or criticisms about this post, please contact me on [LinkedIn](https://www.linkedin.com/in/rodrigobcitadin/). Stay tuned to my social media or this blog for more posts on math, computer science, and philosophy. Stay safe, and see you soon...
