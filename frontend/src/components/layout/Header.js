import React, { Fragment } from 'react'
import '../../App.css'

const Header = () => {
    return (
        <Fragment>
            <nav class="navbar row">
                <div class="col-12 col-md-3">
                    <div class="navbar-brand">
                        <img src="./images/logo2.png" />
                    </div>
                </div>

                <div class="col-12 col-md-6 mt-2 mt-md-0">
                    <div class="input-group">
                        <input
                            type="text"
                            id="search_field"
                            class="form-control"
                            placeholder="Enter Product Name ..."
                        />
                        <div class="input-group-append">
                            <button id="search_btn" class="btn">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <button class="btn" id="login_btn">Login</button>

                    <span id="cart" class="ml-3">Cart</span>
                    <span class="ml-1" id="cart_count">0</span>
                </div>
            </nav>
        </Fragment>
    )
}

export default Header
