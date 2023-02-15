import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import modal from "bootstrap/js/dist/modal";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Alert } from "reactstrap";
import { validate } from "validate.js";

export default function Navbar({ dashboard }: { dashboard: boolean; }) {

    const container = dashboard ? 'container-fluid' : 'container';

    const router = useRouter();

    const [loginModal, setLoginModal] = useState(false);
    const toggleLoginModal = () => setLoginModal(!loginModal);

    const [registerModal, setRegisterModal] = useState(false);
    const toggleRegisterModal = () => setRegisterModal(!registerModal);

    const [errorAlertVisible, setErrorAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('There was an Error. Please Try again.');

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const onErrorDismiss = () => setErrorAlertVisible(false);
    const onSuccessDismiss = () => setSuccessAlertVisible(false);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');


    const supabaseClient = useSupabaseClient();
    const user = useUser();

    const createNewAccount = async () => {

        const constraints = {
            userName: {
                presence: true,
                length: {
                    minimum: 3,
                }
            },
            firstName: {
                presence: true,
                length: {
                    minimum: 3,
                }
            },
            email: {
                presence: true,
                email: true,
                length: {
                    minimum: 1,
                }
            },
            password: {
                presence: true,
                length: {
                    minimum: 1,
                }
            },
            confirmPassword: {
                presence: true,
                length: {
                    minimum: 1,
                }
            },
        };


        const registerInputErrors = validate({
            firstName, userName, password, confirmPassword, email
        }, constraints);


        if (registerInputErrors) {
            setErrorMessage('There was an error with one of your input fields. Please Try again.');
            setErrorAlertVisible(true);
        } else {

            if (password !== confirmPassword) {
                setErrorMessage('Your passwords do not match. Please try again.');
                setErrorAlertVisible(true);
                return;
            }

            try {
                const { error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName ? lastName : '',
                            username: userName
                        }
                    }
                });

                if (error) {
                    setErrorAlertVisible(true);
                    setErrorMessage(error.message);
                    throw error;
                }

                setSuccessMessage(`Welcome ${firstName}, Your account has successfully been created. You must confirm your email before you can login`);
                setSuccessAlertVisible(true);

            } catch (err) {
                console.log(err);
                setErrorMessage('There was an error creating your account. Please try again later.');
                setErrorAlertVisible(true);
            } finally {
                // setSuccessMessage(`Welcome ${firstName}, Your account has successfully been created. You must confirm your email before you can login`);
                // setSuccessAlertVisible(true);
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setUserName('');
                setConfirmPassword('');
            }
        }
    };

    const signInUser = async () => {

        const constraints = {
            email: {
                presence: true,
                email: true,
                length: {
                    minimum: 1,
                }
            },
            password: {
                presence: true,
                length: {
                    minimum: 1,
                }
            }
        };


        const loginInputErrors = validate({
            password, email
        }, constraints);

        console.log(loginInputErrors);

        if (loginInputErrors) {
            setErrorMessage('There was an error. Please Try again.');
            setErrorAlertVisible(true);
        } else {
            try {
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email, password
                });
                if (error) {
                    setErrorMessage(error.message);
                    setErrorAlertVisible(true);
                    setEmail('');
                    setPassword('');
                    throw error;
                };

                router.push('/dashboard/profile');

            } catch (err) {
                console.log(err);
                // setErrorAlertVisible(true);
            }
        }
    };

    const signInWithDiscord = async () => {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'discord'
        });
    };

    const handleLogoutClick = async () => {
        const { error } = await supabaseClient.auth.signOut();
        router.push('/');
    };

    useEffect(() => {
        if (successAlertVisible) {
            setTimeout(() => {
                setSuccessAlertVisible(false);
            }, 2500);
        } else if (errorAlertVisible) {
            setTimeout(() => {
                setErrorAlertVisible(false);
            }, 2500);
        }
    }, [successAlertVisible, errorAlertVisible]);

    return (
        <>

            <Modal isOpen={loginModal} toggle={toggleLoginModal} >
                <ModalBody>
                    <div className="container">
                        <h3 className='text-center pb-2 fw-bold'>Login To Your Account</h3>
                        <Alert color='warning' isOpen={errorAlertVisible} toggle={onErrorDismiss}>
                            {errorMessage}
                        </Alert>
                        <Alert color='success' isOpen={successAlertVisible} toggle={onSuccessDismiss}>
                            {successMessage}
                        </Alert>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <Label for="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="email"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-md-12">
                                <Label for="password">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                                <Button className='mt-4' block={true} color="primary" onClick={signInUser}>
                                    Login
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='border-top'>
                    <div className="container mb-4">
                        <div className="row">
                            <div className="col">
                                <p className='text-center mb-3'>OR</p>
                                <div className="d-flex justify-content-center">
                                    <button onClick={signInWithDiscord} style={{ backgroundColor: '#7289da', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-discord"></i>
                                    </button>
                                    <button style={{ backgroundColor: '#26a7de', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-twitter"></i>
                                    </button>
                                    <button style={{ backgroundColor: '#DB4437', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-google"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>


            <Modal isOpen={registerModal} toggle={toggleRegisterModal} >
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <h3 className='fw-bold text-center pb-4'>Create a New Account</h3>
                            <Alert color='warning' isOpen={errorAlertVisible} toggle={onErrorDismiss}>
                                {errorMessage}
                            </Alert>
                            <Alert color='success' isOpen={successAlertVisible} toggle={onSuccessDismiss}>
                                {successMessage}
                            </Alert>
                            <div className="col-md-6">
                                <Label for="registerFirstName">
                                    First Name
                                </Label>
                                <Input
                                    id="registerFirstName"
                                    name="text"
                                    placeholder="John"
                                    type="text"
                                    onChange={e => setFirstName(e.target.value)}
                                    value={firstName}
                                />
                            </div>
                            <div className="col-md-6">
                                <Label for="registerLastName">
                                    Last Name
                                </Label>
                                <Input
                                    id="registerLastName"
                                    name="text"
                                    placeholder="Doe"
                                    type="text"
                                    onChange={e => setLastName(e.target.value)}
                                    value={lastName}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <Label for="registerEmail">
                                    Email Address
                                </Label>
                                <Input
                                    id="registerEmail"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="email"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <Label for="registerUsername">
                                    Username
                                </Label>
                                <Input
                                    id="registerUsername"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="text"
                                    onChange={e => setUserName(e.target.value)}
                                    value={userName}
                                />
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-md-6">
                                <Label for="registerPassword">
                                    Password
                                </Label>
                                <Input
                                    id="registerPassword"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                            <div className="col-md-6">
                                <Label for="registerConfirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="registerConfirmPassword"
                                    name="email"
                                    placeholder="Johndoe"
                                    type="password"
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />

                            </div>
                            <div className="col-md-12">
                                <Button className='mt-4' block={true} color="primary" onClick={createNewAccount}>
                                    Create Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='border-top'>
                    <div className="container mb-4">
                        <div className="row">
                            <div className="col">
                                <p className='text-center mb-3'>OR</p>
                                <div className="d-flex justify-content-center">
                                    <button onClick={signInWithDiscord} style={{ backgroundColor: '#7289da', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-discord"></i>
                                    </button>
                                    <button style={{ backgroundColor: '#26a7de', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-twitter"></i>
                                    </button>
                                    <button style={{ backgroundColor: '#DB4437', color: '#fff' }} className="btn me-3">
                                        <i className="bi bi-google"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>

            <section id="main-nav">
                <nav className="navbar navbar-expand-lg navbar-dark shadow">
                    <div className={container}>
                        <Link className="navbar-brand" href="/"><img src="/img/SpacedIn.svg" alt="" /></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse " id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" href="/jobs">Jobs</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Team Finder</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Gaming News</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Contact Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Pricing</a>
                                </li>
                                {/* <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li> */}
                            </ul>
                            {user ? (
                                <div className="d-flex align-items-center">
                                    <>
                                        <ul className="navbar-nav ms-auto">
                                            <li className="nav-item dropdown">
                                                <span className="nav-link dropdown-togsgle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    {/* <img className='rounded-circle authenticated-nav-user me-2' src={user.user_metadata.username} alt="" /> */}
                                                    Account <i className="mx-2 bi bi-person"></i>
                                                </span>
                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                                    {/* <li><Link className="dropdown-item" href="/profiles/me">Public Profile</Link></li> */}
                                                    <li><Link className="dropdown-item" href="/profiles/me">Profile</Link></li>
                                                    <li><Link className="dropdown-item" href="/dashboard/organization">Organization</Link></li>

                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><span className="dropdown-item" onClick={handleLogoutClick}>Logout</span></li>
                                                </ul>
                                            </li>
                                        </ul>


                                    </>
                                </div>

                            ) : (
                                <div className="d-flex">
                                    <button className="btn btn-outline-primary rounded-pill" onClick={toggleLoginModal}>Login</button>
                                    <button className="btn btn-outline-secondary rounded-pill ms-2" onClick={toggleRegisterModal}>Register</button>
                                </div>
                            )}

                        </div>
                    </div>
                </nav>
            </section>
        </>
    );

}