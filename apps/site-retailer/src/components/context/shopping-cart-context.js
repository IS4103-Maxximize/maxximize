import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const ShoppingCartContext = createContext();

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user?.organisation?.id;

  const [carts, setCarts] = useState([]);
  const cartsQuantity = carts?.length;

  // API Calls
  // Call backend to get carts
  const retrieveUserCarts = async () => {
    const response = await fetch(
      `http://localhost:3000/api/carts/orgId/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setCarts(result);
  };

  // Add cart item
  const addCartLineItem = async (cartId, finalGoodId, quantity) => {
    const response = await fetch('http://localhost:3000/api/cart-line-items', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartId: cartId,
        finalGoodId: finalGoodId,
        quantity: quantity,
      }),
    });

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();

      retrieveUserCarts(organisationId);
    }
  };

  // Persist a cart and cart line item
  const addCartAndCartLineItem = async (supplierId, finalGoodId, quantity) => {
    console.log(organisationId);
    console.log(supplierId);
    const response = await fetch('http://localhost:3000/api/carts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organisationId: organisationId,
        supplierId: supplierId,
      }),
    });

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();
      await addCartLineItem(result.id, finalGoodId, quantity);
      retrieveUserCarts(organisationId);
    }
  };

  // Update cart line item quantity
  const updateCartLineItem = async (cartLineItemId, quantity) => {
    const response = await fetch(
      `http://localhost:3000/api/cart-line-items/${cartLineItemId}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      }
    );

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();

      retrieveUserCarts(organisationId);
    }
  };

  //Deleting a cart
  const deleteCart = async (cartId) => {
    const response = await fetch(`http://localhost:3000/api/carts/${cartId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();
      return result;
    } else {
      return response.message;
    }
  };

  //Deleting a cart line item
  const deleteCartLineItem = async (cartLineItemId) => {
    const response = await fetch(
      `http://localhost:3000/api/cart-line-items/${cartLineItemId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();

      retrieveUserCarts(organisationId);
    }
  };

  // Get quantity of item in cart
  const isItemInCart = (supplierId, itemId) => {
    if (carts?.some((cart) => cart.supplierId === supplierId)) {
      return carts
        ?.find((cart) => cart.supplierId === supplierId)
        .cartLineItems.some(
          (cartLineItem) => cartLineItem.finalGood.id === itemId
        );
    } else {
      return false;
    }
  };

  // Get quantity of item in cart
  const getItemQuantity = (orgId, itemId) => {
    return (
      carts
        ?.find((cart) => cart.organisation.id === orgId)
        ?.cartLineItems?.find(
          (cartLineItem) => cartLineItem.finalGoodId === itemId
        )?.quantity || 0
    );
  };

  // Set the quantity of an item in cart, if absent, add a cart/lineitem
  const setItemQuantity = (supplier, finalGoodId, quantity) => {
    console.log(supplier);
    console.log(finalGoodId);
    console.log(quantity);

    setCarts((currCarts) => {
      // If cart is absent, add a cart with the line item
      if (
        currCarts?.find((cart) => cart.supplierId === supplier.id) === undefined
      ) {
        console.log('Adding final good to non exisiting cart');
        addCartAndCartLineItem(supplier.id, finalGoodId, quantity);
        // return [
        //   ...currCarts,
        //   {
        //     id: uuid(),
        //     supplier: supplier,
        //     cartLineItems: [{ quantity: quantity, finalGoodId: finalGoodId }],
        //   },
        // ];
      } else {
        // If cart is present but line item is absent
        console.log('Cart is present but line item is absent');
        // return currCarts.map((cart) => {
        currCarts.map((cart) => {
          if (cart.supplierId === supplier.id) {
            console.log('In if block');
            let tempCart = cart;
            // Line Item absent
            if (
              tempCart.cartLineItems.find(
                (lineItem) => lineItem.finalGood.id === finalGoodId
              ) === undefined
            ) {
              addCartLineItem(tempCart.id, finalGoodId, Number(quantity));
              //   tempCart.cartLineItems.push({
              //     quantity: Number(quantity),
              //     finalGoodId: finalGoodId,
              //   });
              // If cart and line item is present
            } else {
              console.log('In else block');

              tempCart.cartLineItems.map((lineItem) => {
                if (lineItem.finalGood.id === finalGoodId) {
                  updateCartLineItem(lineItem.id, quantity);
                  // lineItem.quantity = quantity;
                  // return lineItem;
                }
                //   } else {
                //     return lineItem;
                //   }
              });
            }
            // return tempCart;
          } else {
            // return cart;
          }
        });
      }
    });
  };

  //   const decreateCartQuantity = (id) => {
  //     setCartItems((currItems) => {
  //       if (currItems.find((item) => item.id === id) === null) {
  //         return [...currItems, { id, quantity: 1 }];
  //       } else {
  //         return currItems.map((item) => {
  //           if (item.id === id) {
  //             return { ...item, quantity: item.quantity - 1 };
  //           } else {
  //             return item;
  //           }
  //         });
  //       }
  //     });
  //   };

  // Completely remove a cart
  const removeCart = async (supplierId) => {
    const cartToRemoveId = carts.find(
      (cart) => cart.supplierId === supplierId
    ).id;

    // This will delete the cart as if the line item is the final one
    const result = await deleteCart(cartToRemoveId);
    retrieveUserCarts();
    return result;
  };

  // Completely remove an item from a cart
  const removeFromCart = (supplierId, finalGoodId) => {
    const containingCart = carts.find((cart) => cart.supplierId === supplierId);
    const lineItemId = containingCart.cartLineItems.find(
      (lineItem) => lineItem.finalGood.id === finalGoodId
    ).id;

    // This will delete the cart as if the line item is the final one
    deleteCartLineItem(lineItemId);

    // State methods
    // Remove the line item first
    // setCarts((currCarts) =>
    //   currCarts.map((cart) => {
    //     if (cart.supplierId === supplierId) {
    //       cart.cartLineItems = cart.cartLineItems.filter(
    //         (item) => item.finalGoodId !== finalGoodId
    //       );

    //       console.log(cart);

    //       return cart;
    //     } else {
    //       return cart;
    //     }
    //   })
    // );

    // Check if the cart is now empty, remove it if it is
    // return setCarts((currCarts) =>
    //   currCarts.filter((currCart) => currCart.cartLineItems.length !== 0)
    // );
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        retrieveUserCarts,
        isItemInCart,
        getItemQuantity,
        setItemQuantity,
        removeCart,
        removeFromCart,
        carts,
        cartsQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
