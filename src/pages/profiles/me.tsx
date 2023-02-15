import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createServerSupabaseClient(context);

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const { data, error, status } = await supabase.from('profiles').select().eq('id', session.user.id).single();

        if (error) throw error;

        return {
            props: {
                data
            }
        };

    } catch (err) {
        console.log(err);
    }


    return {
        props: {

        }
    };
}

export default function Profile({ data }: { data: any; }) {

    const user = useUser();


    return (
        <>
            <Navbar dashboard={false} />
            <section id='profile'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-4 mb-sm-5">
                            <div className="card shadow-sm">
                                <div className="card-body p-md-6 p-lg-7">
                                    <div className="row align-items-center">
                                        <div className="col-lg-3 mb-4 mb-lg-0">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="..." />
                                        </div>
                                        <div className="col-lg-9 px-xl-10">
                                            <div className="bg-dark bg-gradient d-lg-inline-block p-3 mb-3 rounded shadow-sm w-100">
                                                <h3 className="h2 text-danger mb-1">{data.username}</h3>
                                                <Link href='/org' className="text-white text-decoration-none">Owner @lionheart</Link>
                                                <br /><br />
                                                {user ? <Link href='/dashboard/profile' className="btn btn-primary">Profile Settings</Link> : ''}
                                            </div>
                                            <div className="d-flex flex-column">
                                                {/* <div className="mb-2 mb-xl-3"><span className="h5 me-2">Position:</span> NA</div>
                                                <div className="mb-2 mb-xl-3"><span className="h5 me-2">Experience:</span> NA</div> */}
                                                <div className="mb-2 mb-xl-3 "><span className="h5 me-2">Email:</span> <span className='text-danger'></span></div>
                                                <div className="mb-2 mb-xl-3 "><span className="h5 me-2">Twitter:</span><a className='text-danger text-decoration-none' target="_blank" href={`https://www.twitter.com/${data.twitter_username}`}>@{data.twitter_username}</a></div>
                                                <div className=""><span className="h5 me-2">Twitch:</span> <a className='text-danger text-decoration-none' target="_blank" href={`https://www.twitch.tv/${data.twitch_username}`}>twitch.tv/{data.twitch_username}</a></div>
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
                                <h4 className="text-danger mb-3 mb-sm-4">About Me</h4>
                                <p>{data.biography || 'Im not interesting enough for a bio...'} </p>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4 mb-sm-5">
                            <div className="mb-4 mb-sm-5">
                                <span className="section-title text-primary mb-3 mb-sm-4">Games</span>
                                <div className="progress-text">
                                    <div className="row">
                                        <div className="col-6">Valorant</div>
                                        <div className="col-6 text-end">80%</div>
                                    </div>
                                </div>
                                <div className="custom-progress progress progress-medium mb-3" >
                                    {/* <div className="animated custom-bar progress-bar slideInLeft bg-secondary" aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div> */}
                                </div>
                                <div className="progress-text">
                                    <div className="row">
                                        <div className="col-6">CS:GO</div>
                                        <div className="col-6 text-end">90%</div>
                                    </div>
                                </div>
                                <div className="custom-progress progress progress-medium mb-3" >
                                    {/* <div className="animated custom-bar progress-bar slideInLeft bg-secondary" aria-valuemax="100" aria-valuemin="0" aria-valuenow="70" role="progressbar"></div> */}
                                </div>
                                <div className="progress-text">
                                    <div className="row">
                                        <div className="col-6">Rainbow 6</div>
                                        <div className="col-6 text-end">50%</div>
                                    </div>
                                </div>
                                <div className="custom-progress progress progress-medium mb-3" >
                                    {/* <div className="animated custom-bar progress-bar slideInLeft bg-secondary" aria-valuemax="100" aria-valuemin="0" aria-valuenow="70" role="progressbar"></div> */}
                                </div>
                                <div className="progress-text">
                                    <div className="row">
                                        <div className="col-6">Overwatch</div>
                                        <div className="col-6 text-end">60%</div>
                                    </div>
                                </div>
                                <div className="custom-progress progress progress-medium">
                                    {/* <div className="animated custom-bar progress-bar slideInLeft bg-secondary" aria-valuemax="100" aria-valuemin="0" aria-valuenow="70" role="progressbar"></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}