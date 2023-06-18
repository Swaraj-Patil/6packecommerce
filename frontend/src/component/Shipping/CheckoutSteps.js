import React, { Fragment } from 'react'
import { Typography, Stepper, Step, StepLabel } from '@material-ui/core'
import { LocalShipping, LibraryAddCheck, AccountBalance } from '@material-ui/icons'
import './Shipping.css'

const CheckoutSteps = ({ activeStep }) => {

    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShipping />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheck />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalance />
        },
    ]

    const stepStyles = {
        bozSizing: 'border-box',
    }

  return (
    <Fragment>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        { steps.map((step, index) => (
            <Step 
                key={index} 
                active={activeStep === index} 
                completed={activeStep >= index}
            >
                <StepLabel 
                    icon={step.icon}
                    style={{ color: activeStep >= index ? 'tomato' : 'rgba(0,0,0,0.649)' }}
                >
                    {step.label}
                </StepLabel>
            </Step>
        )) }
      </Stepper>
    </Fragment>
  )
}

export default CheckoutSteps
