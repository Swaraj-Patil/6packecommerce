import React, { Fragment } from 'react'
import './Shipping.css'
import { useSelector, useDispatch } from 'react-redux'
import { saveShippingInfo } from '../../redux/actions/cartActions'
import { MetaData } from '../layout'
import { PinDrop, Home, LocationCity, Public, Phone, TransferWithinAStation } from '@material-ui/icons'
import { Country, State } from 'country-state-city'
import { useAlert } from 'react-alert'
import { useState } from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useNavigate } from 'react-router-dom'

const Shipping = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [state, setState] = useState(shippingInfo.state)
    const [country, setCountry] = useState(shippingInfo.country)
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode)
    const [contactNo, setcontactNo] = useState(shippingInfo.contactNo)

    const shippingSubmit = e => {
        e.preventDefault()

        if (contactNo.length !== 10) {
            alert.error('Phone number should be 10 digits long.')
            return
        }

        dispatch(saveShippingInfo({
            address,
            city,
            state,
            country,
            pinCode,
            contactNo
        }))

        navigate('/order/confirm')
    }
    return (
        <Fragment>
            <MetaData title='Shipping Details' />
            <CheckoutSteps activeStep={0} />

            <div className="shipping-container">
                <div className="shipping-box">
                    <h2 className="shipping-heading">Shipping Details</h2>

                    <form
                        className='shippingForm'
                        encType='multipart/form-data'
                        onSubmit={shippingSubmit}
                    >

                        <div>
                            <Home />
                            <input
                                type='text'
                                placeholder='Address'
                                required
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <LocationCity />
                            <input
                                type='text'
                                placeholder='City'
                                required
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                        </div>

                        <div>
                            <PinDrop />
                            <input
                                type='number'
                                placeholder='Pin Code'
                                required
                                value={pinCode}
                                onChange={e => setPinCode(e.target.value)}
                            />
                        </div>

                        <div>
                            <Phone />
                            <input
                                type='number'
                                placeholder='Phone Number'
                                required
                                value={contactNo}
                                onChange={e => setcontactNo(e.target.value)}
                                size='10'
                            />
                        </div>

                        <div>
                            <Public />
                            <select
                                required
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                            >
                                <option value=''>Country</option>
                                {Country && Country.getAllCountries().map(country => (
                                    <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                ))}
                            </select>
                        </div>

                        {country && (
                            <div>
                                <TransferWithinAStation />
                                <select
                                    required
                                    value={state}
                                    onChange={e => setState(e.target.value)}
                                >
                                    <option value=''>State</option>
                                    { State && State.getStatesOfCountry(country).map(state => (
                                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <input 
                            type="submit" 
                            value="Continue" 
                            className='shipping-button'
                            disabled={!state}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping
