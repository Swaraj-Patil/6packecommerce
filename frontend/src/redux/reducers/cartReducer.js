import {
    ADD_TO_CART, 
    REMOVE_CART_ITEM, 
    SAVE_SHIPPING_INFO
} from '../constants/cartConstants'

export const cartReducer = (
    state = {
        cartItems: [], 
        shippingInfo: {}
    }, 
    action
) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload
            const itemExists = state.cartItems.find(cartItem => cartItem.product === item.product)

            if (itemExists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(cartItem => cartItem.product === itemExists.product ? item : cartItem)
                }
            } else {
                return {
                    ...state,
                    cartItems: [ ...state.cartItems, item ]
                }
            }

        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(cartItem => cartItem.product !== action.payload)
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }

        default:
            return state
    }
}
