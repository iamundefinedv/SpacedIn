import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import modal from "bootstrap/js/dist/modal";
import Link from "next/link";
import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from "reactstrap";

export default function Navbar({ dashboard }: { dashboard: boolean; }) {

    const [loginModal, setLoginModal] = useState(false);
    const toggleLoginModal = () => setLoginModal(!loginModal);

    const [registerModal, setRegisterModal] = useState(false);
    const toggleRegisterModal = () => setRegisterModal(!registerModal);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');


    const supabaseClient = useSupabaseClient();
    const user = useUser();

    const createNewAccount = async () => {



        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: '',
                password: '',
                options: {
                    data: {
                        first_name: 'John',
                        last_name: 27,
                    }
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    const handleLogoutClick = async () => {
        const { error } = await supabaseClient.auth.signOut();
    };

    return (
        <>

            <Modal className="container" isOpen={loginModal} toggle={toggleLoginModal} >
                <ModalBody>
                    <h3 className='text-center pb-2 fw-bold'>Login To Your Account</h3>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <Label for="exampleEmail">
                                Username
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="Johndoe"
                                type="email"
                            />
                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col-md-12">
                            <Label for="exampleEmail">
                                Password
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="Johndoe"
                                type="password"
                            />
                            <Button className='mt-4' block={true} color="primary" onClick={toggleLoginModal}>
                                Login
                            </Button>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='border-top'>
                    <div className="container mb-4">
                        <div className="row">
                            <div className="col">
                                <p className='text-center mb-3'>OR</p>
                                <div className="d-flex justify-content-center">
                                    <button style={{ backgroundColor: '#7289da', color: '#fff' }} className="btn me-3"><i className="bi bi-discord"></i></button>
                                    <button style={{ backgroundColor: '#26a7de', color: '#fff' }} className="btn me-3"><i className="bi bi-twitter"></i></button>
                                    <button style={{ backgroundColor: '#DB4437', color: '#fff' }} className="btn me-3"><i className="bi bi-google"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>


            <Modal isOpen={registerModal} toggle={toggleRegisterModal} >
                <ModalBody>
                    <div className="row">
                        <h3 className='fw-bold text-center pb-4'>Create a New Account</h3>
                        <div className="col-md-6">
                            <Label for="exampleEmail">
                                First Name
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="John"
                                type="text"
                                onChange={e => setFirstName(e.target.value)}
                                value={firstName}
                            />
                        </div>
                        <div className="col-md-6">
                            <Label for="exampleEmail">
                                Last Name
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="Doe"
                                type="text"
                                onChange={e => setLastName(e.target.value)}
                                value={lastName}
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <Label for="exampleEmail">
                                Email Address
                            </Label>
                            <Input
                                id="exampleEmail"
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
                            <Label for="exampleEmail">
                                Username
                            </Label>
                            <Input
                                id="exampleEmail"
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
                            <Label for="exampleEmail">
                                Password
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="Johndoe"
                                type="text"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <div className="col-md-6">
                            <Label for="exampleEmail">
                                Confirm Password
                            </Label>
                            <Input
                                id="exampleEmail"
                                name="email"
                                placeholder="Johndoe"
                                type="text"
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
                </ModalBody>
                <ModalFooter className='border-top'>
                    <div className="container mb-4">
                        <div className="row">
                            <div className="col">
                                <p className='text-center mb-3'>OR</p>
                                <div className="d-flex justify-content-center">
                                    <button style={{ backgroundColor: '#7289da', color: '#fff' }} className="btn me-3"><i className="bi bi-discord"></i></button>
                                    <button style={{ backgroundColor: '#26a7de', color: '#fff' }} className="btn me-3"><i className="bi bi-twitter"></i></button>
                                    <button style={{ backgroundColor: '#DB4437', color: '#fff' }} className="btn me-3"><i className="bi bi-google"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>

            <section id="main-nav">
                <nav className="navbar navbar-expand-lg navbar-dark shadow">
                    <div className="container">
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
                                    <a className="nav-link" href="#">Team Finder</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Gaming News</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contact Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Pricing</a>
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
                                                <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <img className='rounded-circle authenticated-nav-user me-2' src={user.user_metadata.avatar_url} alt="" />
                                                    {/* {user.user_metadata.full_name} */}
                                                </Link>
                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                                    {/* <li><Link className="dropdown-item" href="/profiles/me">Public Profile</Link></li> */}
                                                    <li><Link className="dropdown-item" href="/profiles/me">Profile</Link></li>
                                                    <li><Link className="dropdown-item" href="/dashboard/organization">Organization</Link></li>

                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><a className="dropdown-item" href="#!" onClick={handleLogoutClick}>Logout</a></li>
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