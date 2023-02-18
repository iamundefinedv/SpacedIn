import Footer from '@/components/Footer';
import JobPostingCard from '@/components/cards/JobPostingCard';
import Navbar from '@/components/Navbar';

export default function Home() {
    return (
        <>
            <Navbar dashboard={false}/>
            <section id="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 text-sm-center col-lg-6 mt-md-5">
                            <h1>ONE PLACE, <br/> ALL YOUR GAMING NEEDS</h1>
                            <p className="text-muted mt-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis lacus ultrices ex
                                condimentum fringilla malesuada a metus. Praesent sollicitudin lacinia scelerisque. Nam
                                vel dolor at mi consectetur tempor quis sed turpis. Mauris nulla lacus, commodo at
                                laoreet et, fringilla a magna. Nam ac orci vestibulum, cursus justo sit amet, aliquet
                                nunc. Nulla elit neque, varius at ornare nec, consectetur eget sapien. Aenean ut viverra
                                tortor. Aliquam elementum venenatis suscipit
                            </p>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 float-end">
                            <div className="d-flex justify-content-center">
                                <img src="/img/peoplehero.svg" className='img-responsive' alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="postings">
                <div className="container mt-5">
                    <div className="row">
                        {/*<div className="col-md-6">*/}
                        {/*    <h3 className='text-center mb-4'>Latest eSports Jobs</h3>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*</div>*/}
                        {/*<div className="col-md-6">*/}
                        {/*    <h3 className='text-center mb-4'>Latest Free Agents</h3>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*    <JobPostingCard/>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
}
