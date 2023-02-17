export default function Footer() {
    return (
        <>
            <div className="container">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4">
                    <div className="container">
                        <div className="row">
                            <p className="col-md-4 mb-0 text-muted mt-2">&copy; 2023 ScopedIn, Inc</p>

                            <a href="/" className="col-md-4 d-flex justify-content-center  mb-md-0 me-md-auto link-dark text-decoration-none">
                                <img width={50} height={50} src="/img/scopedin.png" alt="" />
                            </a>

                            <ul className="nav col-md-4 justify-content-end">
                                <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Jobs</a></li>
                                <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Team Finder</a></li>
                                <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">News</a></li>
                                <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">About</a></li>
                                <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}