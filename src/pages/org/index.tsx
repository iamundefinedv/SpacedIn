import JobPostingCard from "@/components/cards/JobPostingCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Org() {

    return (
        <>
            <Navbar dashboard={false} />
            <section id="org">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-4 mb-sm-5">
                            <div className="card shadow-sm">
                                <div className="card-body p-md-6 p-lg-7">
                                    <div className="row align-items-center">
                                        <div className="col-lg-3 mb-4 mb-lg-0">
                                            <img className='org-logo' src="/img/lionheartlogo.png" alt="..." />
                                        </div>
                                        <div className="col-lg-9 px-xl-10">
                                            <div style={{ backgroundColor: '#FFD601' }} className="bg-gradient d-lg-inline-block p-3 mb-3 rounded shadow-sm w-100">
                                                <h3 className="h2 text-danger mb-1">Lionheart</h3>
                                                <span className="text-muted">Owner @bossmanhonor</span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="mb-2 mb-xl-3"><span className="h5 me-2">Followers:</span> 400</div>
                                                <div className="mb-2 mb-xl-3"><span className="h5 me-2">Staff:</span> 6-12</div>
                                                <div className="mb-2 mb-xl-3 "><span className="h5 me-2">Email:</span> lionheart@mail.com</div>
                                            </div>
                                            <div className="d-flex mt-3 float-end">
                                                <div className='me-2'><a href="#!"><i className="bi bi-twitter text-danger"></i></a></div>
                                                <div className='me-2'><a href="#!"><i className="bi bi-facebook text-danger"></i></a></div>
                                                <div className='me-2'><a href="#!"><i className="bi bi-pinterest text-danger"></i></a></div>
                                                <div className='me-2'><a href="#!"><i className="bi bi-instagram text-danger"></i></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 mb-4 mb-sm-5">
                            <div>
                                <h4 className="text-danger mb-3 mb-sm-4">About Us</h4>
                                <p>Edith is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed.</p>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4 mb-sm-5">
                            <h4 className="text-danger mb-3 mb-sm-4">Our Postings</h4>
                            <JobPostingCard />
                            <JobPostingCard />
                            <JobPostingCard />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}