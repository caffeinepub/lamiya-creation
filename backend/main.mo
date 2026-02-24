import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    sizes : [Text];
    stock : Nat;
    imageUrl : Text;
  };

  type CartItem = {
    productId : Nat;
    size : Text;
    quantity : Nat;
  };

  type Order = {
    orderId : Nat;
    items : [CartItem];
    totalAmount : Nat;
    deliveryName : Text;
    deliveryAddress : Text;
    status : Text;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;
  var nextOrderId = 1;
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Principal, List.List<Order>>();

  // Product comparison for sorting
  module Product {
    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };
  };

  // Seed functions
  func seedInitialProducts() {
    let initialProducts = [
      {
        id = nextProductId;
        name = "Classic White Kurta";
        description = "Pure cotton, perfect for casual wear";
        price = 1200;
        category = "Casual";
        sizes = ["S", "M", "L", "XL"];
        stock = 30;
        imageUrl = "https://example.com/white-kurta.jpg";
      },
      {
        id = nextProductId + 1;
        name = "Festive Red Kurta";
        description = "Silk blend, ideal for celebrations";
        price = 2500;
        category = "Festive";
        sizes = ["M", "L", "XL", "XXL"];
        stock = 20;
        imageUrl = "https://example.com/red-kurta.jpg";
      },
      {
        id = nextProductId + 2;
        name = "Blue Embroidered Kurta";
        description = "Elegant embroidery for special occasions";
        price = 3000;
        category = "Embroidered";
        sizes = ["S", "M", "L"];
        stock = 15;
        imageUrl = "https://example.com/blue-kurta.jpg";
      },
      {
        id = nextProductId + 3;
        name = "Casual Yellow Kurta";
        description = "Lightweight fabric, daily wear";
        price = 1100;
        category = "Casual";
        sizes = ["M", "L", "XL"];
        stock = 25;
        imageUrl = "https://example.com/yellow-kurta.jpg";
      },
      {
        id = nextProductId + 4;
        name = "Green Festive Kurta";
        description = "Bright color, festive design";
        price = 2700;
        category = "Festive";
        sizes = ["S", "M", "L", "XL", "XXL"];
        stock = 18;
        imageUrl = "https://example.com/green-kurta.jpg";
      },
      {
        id = nextProductId + 5;
        name = "Black Embroidered Kurta";
        description = "Detailed embroidery, premium quality";
        price = 3200;
        category = "Embroidered";
        sizes = ["M", "L"];
        stock = 12;
        imageUrl = "https://example.com/black-kurta.jpg";
      },
    ];

    for (product in initialProducts.values()) {
      products.add(product.id, product);
      nextProductId += 1;
    };
  };

  func addLamiyaCreationEdition() {
    let lamiyaProduct : Product = {
      id = nextProductId;
      name = "Lamiya Creation Edition Kurta";
      description = "Exclusive premium design, gold thread chikan kari embroidery, finest fabrics, detailed handwork, limited edition, luxury ethnic wear.";
      price = 4999;
      category = "Premium";
      sizes = ["S", "M", "L", "XL", "XXL"];
      stock = 10;
      imageUrl = "https://example.com/lamiya-creation-edition.jpg";
    };
    products.add(nextProductId, lamiyaProduct);
    nextProductId += 1;
  };

  func seedFullCatalogProducts() {
    let catalogProducts : [Product] = [
      {
        id = nextProductId;
        name = "Straight Cotton Plazo";
        description = "Comfortable straight fit, soft cotton fabric.";
        price = 799;
        category = "Plazo";
        sizes = ["S", "M", "L"];
        stock = 50;
        imageUrl = "https://example.com/straight-cotton-plazo.jpg";
      },
      {
        id = nextProductId + 1;
        name = "A-Line Cotton Kurta";
        description = "Elegant A-line cut, premium cotton, summer wear.";
        price = 1499;
        category = "Casual";
        sizes = ["S", "M", "L", "XL"];
        stock = 40;
        imageUrl = "https://example.com/a-line-kurta.jpg";
      },
      {
        id = nextProductId + 2;
        name = "Block Print Anarkali Suit";
        description = "Traditional block print design, flared anarkali style.";
        price = 2399;
        category = "Suits";
        sizes = ["M", "L", "XL"];
        stock = 30;
        imageUrl = "https://example.com/block-print-anarkali.jpg";
      },
      {
        id = nextProductId + 3;
        name = "Chikan Kari Kurta Set";
        description = "Exquisite chikan kari embroidery, kurta with matching plazos.";
        price = 2999;
        category = "Ethnic Set";
        sizes = ["S", "M", "L", "XL", "XXL"];
        stock = 25;
        imageUrl = "https://example.com/chikan-kari-kurta-set.jpg";
      },
      {
        id = nextProductId + 4;
        name = "Premium Festive Kurta";
        description = "Rich fabrics, gold/silver embroidery, luxury festive wear.";
        price = 3599;
        category = "Festive";
        sizes = ["M", "L", "XL", "XXL"];
        stock = 15;
        imageUrl = "https://example.com/premium-festive-kurta.jpg";
      },
      {
        id = nextProductId + 5;
        name = "Daily Wear Straight Kurta";
        description = "Classic straight cut, breathable fabric, perfect for daily use.";
        price = 999;
        category = "Casual";
        sizes = ["S", "M", "L", "XL"];
        stock = 60;
        imageUrl = "https://example.com/daily-straight-kurta.jpg";
      },
    ];

    for (product in catalogProducts.values()) {
      products.add(product.id, product);
      nextProductId += 1;
    };
  };

  // Seed all products on initialization
  func seedBackendAllProducts() {
    seedInitialProducts();
    addLamiyaCreationEdition();
    seedFullCatalogProducts();
  };

  seedBackendAllProducts();

  // Public queries and updates
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  public query ({ caller }) func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, category : Text, sizes : [Text], stock : Nat, imageUrl : Text) : async Nat {
    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      category;
      sizes;
      stock;
      imageUrl;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Nat, category : Text, sizes : [Text], stock : Nat, imageUrl : Text) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          category;
          sizes;
          stock;
          imageUrl;
        };
        products.add(id, updatedProduct);
    };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    products.remove(id);
  };

  public shared ({ caller }) func addToCart(productId : Nat, size : Text, quantity : Nat) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (quantity > product.stock) {
          Runtime.trap("Not enough stock available");
        };

        let cart = switch (carts.get(caller)) {
          case (null) { List.empty<CartItem>() };
          case (?existingCart) { existingCart };
        };

        cart.add({
          productId;
          size;
          quantity;
        });

        carts.add(caller, cart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat, size : Text) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let filteredCart = cart.filter(
          func(item) {
            item.productId != productId or item.size != size;
          }
        );
        carts.add(caller, filteredCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  public shared ({ caller }) func checkout(deliveryName : Text, deliveryAddress : Text) : async Nat {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let items = cart.toArray();
        if (items.size() == 0) { Runtime.trap("Cart is empty") };

        var totalAmount = 0;
        for (item in items.values()) {
          switch (products.get(item.productId)) {
            case (null) { Runtime.trap("Invalid product in cart") };
            case (?product) {
              totalAmount += product.price * item.quantity;
            };
          };
        };

        let newOrder : Order = {
          orderId = nextOrderId;
          items;
          totalAmount;
          deliveryName;
          deliveryAddress;
          status = "pending";
        };

        let userOrders = switch (orders.get(caller)) {
          case (null) { List.empty<Order>() };
          case (?existingOrders) { existingOrders };
        };

        userOrders.add(newOrder);
        orders.add(caller, userOrders);

        nextOrderId += 1;
        carts.remove(caller);

        newOrder.orderId;
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    switch (orders.get(caller)) {
      case (null) { [] };
      case (?userOrders) { userOrders.toArray() };
    };
  };
};
