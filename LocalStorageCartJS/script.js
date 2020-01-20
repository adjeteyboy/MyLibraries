function fakeAPI(id) {
  if (id === 1111) {
    return {
      id: 1111,
      name: 'Samsung J5 2016',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1571453818328-b15ea3ba8ea8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=150&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=150'
    }
  } else if (id === 2222) {
    return {
      id: 2222,
      name: 'Samsung S7 Edge',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1565967249821-083c4775e5bc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=150&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=150'
    }
  } else if (id === 3333) {
    return {
      id: 3333,
      name: 'Samsung S10 xl',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1552233659-012e177ed56d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=150&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=150'
    }
  }
}

// should be for cart page
document.addEventListener('DOMContentLoaded', function() {
  updateAllHTML();
})


function addToCart(productID) {
  let result = fakeAPI(productID)

  // get cart from localStorage, if empty create new one
  var cartFromLocalStore = getCartStorage()
  if (!cartFromLocalStore) {

    let cartObj = {}
    // create the product obj useful for cart
    cartObj[productID] = {
      id: productID,
      name: result.name,
      price: result.price,
      quantity: 1,
      productTotal: result.price * 1,
      image: result.image,
      // category: result.categories[0].name
    }
    cartObj.total = new BigNumber(result.price).toFixed(2);

    var cartObjStr = JSON.stringify(cartObj)
    localStorage.setItem('userCart', cartObjStr)
  } else {

    let cartObj = { ...cartFromLocalStore }
    if (cartObj[productID] && cartObj[productID].quantity < 20) {
      cartObj[productID] = {
        id: productID,
        name: result.name,
        price: result.price,
        quantity: cartObj[productID].quantity,
        image: result.image,
        // category: result.categories[0].name
      }
      cartObj[productID].quantity++;
      cartObj[productID].productTotal = cartObj[productID].price * cartObj[productID].quantity;
    } else if (cartObj[productID] && cartObj[productID].quantity >= 20) {
      return;
    } else {
      cartObj[productID] = {
        id: productID,
        name: result.name,
        price: result.price,
        quantity: 1,
        productTotal: result.price,
        image: result.image,
        // category: result.categories[0].name
      }
    }

    // cartObj.total is str so parseInt to make number it
    //  then fix floating numbers with BigNumber library

    // get all keys except the total key on the obj
    totalProductsInLocalStorage(cartObj)
  }
}

function getCartStorage () {
  return JSON.parse(localStorage.getItem('userCart'))
}

function totalProductsInLocalStorage(cartObj) {
  var everyObjWithoutTotal = Object.keys(cartObj).filter(key => key !== 'total').map(el => cartObj[el].productTotal)
  // let finalTotal = new BigNumber(Number(cartObj['total']) + cartObj[productID].productTotal).toFixed(2)
  // reduce to clear haha
  let cartTotal = everyObjWithoutTotal.reduce((total, num) => {
    return total + num;
  })
  let cartBigNumberTotal = new BigNumber(cartTotal).toFixed(2);
  cartObj.total = cartBigNumberTotal;
  localStorage.setItem('userCart', JSON.stringify(cartObj));
  // update the dom with the total where needed
}

function removeItemFromCart(id) {
  let cartObj = getCartStorage();
  var filterIdAndTotalOut = Object.keys(cartObj).filter(key => key !== 'total').filter(key => key !== `${id}`).map(el => cartObj[el])
  let returnObj = {}

  filterIdAndTotalOut.forEach(obj => {
    return returnObj[obj.id] = obj
  })
  totalProductsInLocalStorage(returnObj)
  updateAllHTML()
}

function updateAllHTML() {
  // receives current cart and update necessary elements who need to be changed
  // total elements, cart items, and cart item's quantity select element

  let totalElOnPage = document.querySelectorAll('.cart-total__num')
  const cartContainer = document.getElementById('cart__page-container')
  let cartObj = getCartStorage();
  totalElOnPage.forEach(el => el.innerHTML = cartObj.total)
  cartContainer.innerHTML = ''
  // loop through our cart objects and update the dom
  Object.values(removeTotal(cartObj)).forEach(obj => {
    cartContainer.insertAdjacentHTML('beforeend', `
    <div class="cart__page-item cart-item1">
      <p>${obj.name}</p>
      <p>${obj.price}</p>
      <button onclick="removeItemFromCart(${obj.id})">Remove</button>
    </div>
    `)
  })
}

function removeTotal(obj) {
  let returnObj = {}
  Object.keys(obj).filter(key => key !== 'total').forEach(id => {
    return returnObj[id] = obj[id]
  })
  return returnObj
}