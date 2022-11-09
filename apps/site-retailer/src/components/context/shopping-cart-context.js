import { createContext, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

const ShoppingCartContext = createContext();

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);

  const cartsQuantity = carts.length;

  // Call backend to get carts
  const retrieveUserCarts = async () => {
    const response = await fetch(`http://localhost:3000/api/carts`);

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setCarts(result);
  };

  // Get quantity of item in cart
  const isItemInCart = (orgId, itemId) => {
    if (carts.some((cart) => cart.organisation.id === orgId)) {
      console.log(
        carts
          .find((cart) => cart.organisation.id === orgId)
          .cartLineItems.some(
            (cartLineItem) => cartLineItem.finalGoodId === itemId
          )
      );
      return carts
        .find((cart) => cart.organisation.id === orgId)
        .cartLineItems.some(
          (cartLineItem) => cartLineItem.finalGoodId === itemId
        );
    } else {
      return false;
    }
  };

  // Get quantity of item in cart
  const getItemQuantity = (orgId, itemId) => {
    return (
      carts
        .find((cart) => cart.organisation.id === orgId)
        ?.cartLineItems?.find(
          (cartLineItem) => cartLineItem.finalGoodId === itemId
        )?.quantity || 0
    );
  };

  // Set the quantity of an item in cart, if absent, add a cart/lineitem
  const setItemQuantity = (org, finalGoodId, quantity) => {
    setCarts((currCarts) => {
      // If cart is absent, add a cart with the line item
      if (
        currCarts.find((cart) => cart.organisation.id === org.id) === undefined
      ) {
        console.log('Adding final good to non exisiting cart');
        return [
          ...currCarts,
          {
            id: uuid(),
            organisation: org,
            cartLineItems: [{ quantity: quantity, finalGoodId: finalGoodId }],
          },
        ];
      } else {
        // If cart is present but line item is absent
        console.log('Cart is present but line item is absent');
        return currCarts.map((cart) => {
          if (cart.organisation.id === org.id) {
            console.log('In if block');
            let tempCart = cart;
            if (
              tempCart.cartLineItems.find(
                (lineItem) => lineItem.finalGoodId === finalGoodId
              ) === undefined
            ) {
              tempCart.cartLineItems.push({
                quantity: Number(quantity),
                finalGoodId: finalGoodId,
              });
              // If cart and line item is present
            } else {
              console.log('In else block');
              console.log(cart);
              tempCart.cartLineItems.map((lineItem) => {
                if (lineItem.finalGoodId === finalGoodId) {
                  lineItem.quantity = quantity;
                  return lineItem;
                } else {
                  return lineItem;
                }
              });
            }
            return tempCart;
          } else {
            return cart;
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

  // Completely remove an item from a cart
  const removeFromCart = (orgId, finalGoodId) => {
    // Remove the line item first
    setCarts((currCarts) =>
      currCarts.map((cart) => {
        if (cart.organisation.id === orgId) {
          cart.cartLineItems = cart.cartLineItems.filter(
            (item) => item.finalGoodId !== finalGoodId
          );

          console.log(cart);

          return cart;
        } else {
          return cart;
        }
      })
    );

    // Check if the cart is now empty, remove it if it is
    return setCarts((currCarts) =>
      currCarts.filter((currCart) => currCart.cartLineItems.length !== 0)
    );
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        retrieveUserCarts,
        isItemInCart,
        getItemQuantity,
        setItemQuantity,
        removeFromCart,
        carts,
        cartsQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
