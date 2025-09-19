# EcommerceApp
## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Architecture overview
### Services
#### ApiService
Provides API for getting all product data from the endpoint.
#### CartService
Fetches products via the ApiService and cleans up the data. Handles incrementing, decrementing and changing the amount of products in the cart and product removal. CartComponent and ProductListPageComponent both call into CartService to perform cart content changes. This is a shared service responsible for data sharing between the two components.
### Components
#### CartComponent
Handles the display of shopping cart contents and changing product amounts from the cart view. Also handles displaying the total price of the items in cart.
#### ProductListPageComponent
Handles the listing of all available shop products, allows changing the amount of products placed in the shopping cart.
### Routing
Go to buttons navigate between the product list and cart views via the router.
### Interfaces
#### Product
Interface used for product representation in the app.
## User's manual
### Product list
The application launches with the product list page, you can use the + and - buttons or the text input fields to add products to the shopping cart. Some products have a minimum order amount which is indicated by a message. You cannot put more products in the cart than the available amount. The trash can button removes the relevant product from the cart.
Use the Go to Cart button to navigate to the shopping cart view.
### Shopping cart
The shopping cart lists all the products currently placed in your cart and calculates the total price of products. You can change the product amount using the same buttons and text input as in the product list. If you enter 0 or less than the minimum orderable amount for a product it is removed from the cart. You can use the Go back to list button to navigate back to the product list.
