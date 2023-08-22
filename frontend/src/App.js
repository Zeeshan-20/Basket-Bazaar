import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import * as React from "react";
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap'
import { Badge, Button, Nav, NavDropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Store } from "./store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from './screens/ProfileScreen';
import axios from "axios";
import { getError } from "./utils";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter >
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        } id="whole-body"
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header >
          {/* bg="dark" variant="dark"  */}
          <Navbar expand="lg" id="navbar-color">
            <Container>
              {/* for sidebar variant="dark" */}
              <Button id="navbar-btn" className="navbar-hov" variant="light"

                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              {/* side bar end  */}
              <LinkContainer to="/"><Navbar.Brand id="navbar-heading"> <img id="logo-leaf" src="/images/slider/leaf.jpg" alt="logo-img"></img>Earthy Delights</Navbar.Brand></LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                {/* search box */}
                <SearchBox />
                {/* search box end */}
                <Nav className="me-auto w-100 justify-content-end" >
                  <Link to='/cart' className="nav-link">
                    <ShoppingCartIcon id="cart-icon" />
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.length}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ?
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item id="basic-nav-dropdown-item">User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/orderhistory'>
                        <NavDropdown.Item id="basic-nav-dropdown-item">Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item" to="#signout" onClick={signoutHandler} id="basic-nav-dropdown-item">
                        <strong>Sign Out</strong>
                      </Link>
                    </NavDropdown> :
                    <Link className='nav-link' to='/signin' id="admin-nav-dropdown">
                      Sign In
                    </Link>}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

        </header>
        {/* side bar start  */}
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          } id="nav-left"
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item id="nav-left-heading">
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer id="nav-left-categories"
                  // to={`/search/category=${category}`}
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        {/* side bar end */}
        <main id="body-color">
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>}></Route>
              <Route path="/orderhistory" element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <div id="footer-styling">
        <footer>
          <div className="container">
            <div className="sec aboutus">
              <h2>About Us</h2>
              <p>Explore Organic Veggies & Fruits with Eco-Friendly Packaging!<br/>Welcome to our e-commerce platform where you can discover a range of organic vegetables and fruits. Plus, we're committed to eco-conscious practices, offering biodegradable packaging options. Embrace a healthier lifestyle while caring for the environment.<br/>Shop now for nature's bounty and sustainable choices!</p>
              <ul className="sci">
              <li><Link to="#"><i class="fa fa-brands fa-facebook-f" ></i></Link></li>
              <li><Link to="#"><i class="fa fa-brands fa-twitter"></i></Link></li>
              <li><Link to="#"><i class="fa fas fa-brands fa-instagram"></i></Link></li>
              <li><Link to="#"><i class="fa fas fa-brands fa-youtube"></i></Link></li>
            </ul>
            </div>
            <div className="sec quickLinks">
              <h2>Quick Links</h2>
              <ul id="footer-quickLinks">
                <li><Link to="#">About</Link></li>
                <li><Link to="#">FAQ</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Help</Link></li>
                <li><Link to="#">Terms & Conditions</Link></li>
                <li><Link to="#">Contact</Link></li>
              </ul>
            </div>
            <div className="sec contact">
              <h2>Contact Info</h2>
              <ul class="info">
                <li>
                <span><i class="fa fa-solid fa-location-dot fa-fade" aria-hidden="true" ></i></span>
                <span>647 Linda Street <br/>Dehradun, PA 19460,<br/>India</span>
                </li>
                <li>
                <span><i class="fa fa-solid fa-phone fa-shake" aria-hidden="true"></i></span>
                <p><Link to="tel:123456789">+91 234 567 8900</Link><br/><Link to="tel:123456789">+91 567 234 8900</Link></p>
                </li>
                <li>
                <span><i class="fa fa-solid fa-envelope fa-bounce" aria-hidden="true"></i></span>
                <p> <Link to="mailto:earthydelights123@gmail.com">EarthyDelights@gmail.com</Link></p>
                </li>
              </ul>
            </div>
          </div>
        </footer>
        <div class="copyrightText">
          <p>Copyright © 2023 Earthy Delights. All Rights Reserved</p>
        </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;