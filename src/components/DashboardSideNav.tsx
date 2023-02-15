import Link from "next/link";

export default function DashboardSideNav({ profile, createOrg = false }: { profile: boolean, createOrg?: boolean; }) {
    return (
        <>
            <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark shadow" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="nav">
                            {profile ? <>
                                <div className="sb-sidenav-menu-heading">My Profile</div>
                                <Link className="nav-link" href="/dashboard/profile">
                                    <div className="sb-nav-link-icon"><i className="bi bi-tachometer"></i></div>
                                    Dashboard
                                </Link>
                                <Link className="nav-link" href="/dashboard">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Notifications
                                </Link>
                                <Link className="nav-link" href="/dashboard/profile/settings">
                                    <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                    Documents
                                </Link> <Link className="nav-link" href="/dashboard/profile/applications">
                                    <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                    Applications
                                </Link>
                                {/* <div className="sb-sidenav-menu-heading">Profile Settings</div> */}
                                <Link className="nav-link" href="/dashboard">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Subscription
                                </Link>
                                {createOrg ? '' : <Link className="btn btn-sm btn-primary mx-2 mt-3" href="/dashboard/create-org">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Create An Org
                                </Link>}
                            </> : <>
                                <div className="sb-sidenav-menu-heading">Organization</div>
                                <Link className="nav-link" href="/dashboard/profile/settings">
                                    <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                    Staff Members
                                </Link>
                                <Link className="nav-link" href="/dashboard/profile/settings">
                                    <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                    Our Job Postings
                                </Link>
                                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                                    Applications
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="layout-static.html">Player Positions</a>
                                        <a className="nav-link" href="layout-sidenav-light.html">Staff Positions</a>
                                    </nav>
                                </div>
                                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                                    <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                    Pages
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapsePages" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                                            Authentication
                                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </a>
                                        <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                            <nav className="sb-sidenav-menu-nested nav">
                                                <a className="nav-link" href="login.html">Login</a>
                                                <a className="nav-link" href="register.html">Register</a>
                                                <a className="nav-link" href="password.html">Forgot Password</a>
                                            </nav>
                                        </div>
                                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                            Error
                                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </a>
                                        <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                            <nav className="sb-sidenav-menu-nested nav">
                                                <a className="nav-link" href="401.html">401 Page</a>
                                                <a className="nav-link" href="404.html">404 Page</a>
                                                <a className="nav-link" href="500.html">500 Page</a>
                                            </nav>
                                        </div>
                                    </nav>
                                </div>
                            </>}
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}