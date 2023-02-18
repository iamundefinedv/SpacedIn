import DashboardSideNav from "@/components/DashboardSideNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {createServerSupabaseClient, Session} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {GetServerSidePropsContext, NextApiRequest} from "next";
import {useEffect, useState} from "react";
import {Alert} from "reactstrap";


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createServerSupabaseClient(context);

    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const {data, error, status} = await supabase.from("profiles").select().eq("id", session.user.id).single();

    return {
        props: {
            data
        }
    };
}

export default function Profile({session, data}: { session: Session, data: any; }) {

    const supabase = useSupabaseClient();
    const user = useUser();

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);

    const onDismiss = () => setSuccessAlertVisible(false);

    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState();

    const [isProfileSetup, setIsProfileSetup] = useState();

    const [firstName, setFirstName] = useState<string>(data.first_name || "");
    const [lastName, setLastName] = useState<string>(data.last_name || "");
    const [username, setUsername] = useState<string>(data.username || "");
    const [twitterUsername, setTwitterUsername] = useState<string>(data.twitter_username || "");
    const [twitchUsername, setTwitchUsername] = useState<string>(data.twitch_username || "");
    const [youtubeLink, setYoutubeLink] = useState<string>(data.youtube_link || "");
    const [behanceLink, setBehanceLink] = useState<string>(data.behance_link || "");
    const [biography, setBiography] = useState<string>(data.biography || "");


    const getProfile = async () => {
        try {
            setLoading(true);

            // const { data, error, status } = await supabase.from('profiles').select('first_name, last_name, twitter_username, twitch_username, youtube_link, behance_link, biography')

            // if (data) {
            //     setFirstName(data.firstName);
            //     setLastName(data.lastName);
            //     setTwitchUsername(data.twitch_username);
            //     setTwitterUsername(data.twitter_username);
            //     setBiography(data.biography);
            // } else {

            // }

        } catch (err) {
            console.log(err);
        } finally {
            // setTimeout(() => {
            //     setLoading(false);
            // }, 2000);
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {

            const {error} = await supabase.from("profiles").upsert({
                id: user?.id,
                first_name: firstName,
                last_name: lastName,
                username,
                biography,
                // avatar_url: user?.user_metadata.avatar_url,
                twitter_username: twitterUsername,
                twitch_username: twitchUsername,
                behance_link: behanceLink,
                youtube_link: youtubeLink
            });
            if (error) throw error;

            setSuccessAlertVisible(true);

        } catch (err) {
            console.log(err);
            setErrorAlertVisible(true);
        }
    };


    useEffect(() => {
        getProfile();
    }, [session]);
    useEffect(() => {
        if (successAlertVisible) {
            setTimeout(() => {
                setSuccessAlertVisible(false);
            }, 3500);
        } else if (errorAlertVisible) {
            setTimeout(() => {
                setErrorAlertVisible(false);
            }, 3500);
        }
    }, [successAlertVisible, errorAlertVisible]);

    return (
        <>
            <Navbar dashboard={true}/>
            <div id="layoutSidenav">
                <DashboardSideNav profile={true}/>
                <div id="layoutSidenav_content">
                    <main id="profile-settings">
                        <div className="container-fluid px-4 mt-3">
                            <div className="card shadow mb-4">
                                <div className="card-header bg-primary">
                                    <i className="fas fa-table me-1"></i>
                                    Public Profile Information
                                </div>
                                <div className="card-body">
                                    <Alert color="success" isOpen={successAlertVisible} toggle={onDismiss}>
                                        Your profile has successfully been updated
                                    </Alert>
                                    <Alert color="danger" isOpen={errorAlertVisible} toggle={onDismiss}>
                                        There was an error updating your profile. Please try again later.
                                    </Alert>
                                    {loading ? <>
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-danger" role="status">
                                            </div>
                                        </div>
                                    </> : <>
                                        <div className="container pb-5">
                                            <div className="row">
                                                <div className="col-md-12 mt-3">
                                                    <span>
                                                        <div className="row">
                                                            <div className="col">
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="exampleFormControlInput1">First Name</label>
                                                                    <input onChange={e => setFirstName(e.target.value)}
                                                                           value={firstName} type="text"
                                                                           className="form-control mt-2"
                                                                           id="exampleFormControlInput1"
                                                                           placeholder="John"/>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="exampleFormControlInput1">Last Name</label>
                                                                    <input value={lastName}
                                                                           onChange={e => setLastName(e.target.value)}
                                                                           type="text" className="form-control mt-2"
                                                                           id="exampleFormControlInput1"
                                                                           placeholder="Doe"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-6">
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="exampleFormControlInput1">Username</label>
                                                                    <input value={username}
                                                                           onChange={e => setUsername(e.target.value)}
                                                                           type="text" className="form-control mt-2"
                                                                           id="exampleFormControlInput1"
                                                                           placeholder="johnDoe001"/>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 mt-4">
                                                                <div className="form-group">
                                                                    <div className="d-flex justify-content-center">
                                                                        <button style={{
                                                                            backgroundColor: "#7289da",
                                                                            color: "#fff"
                                                                        }} className="btn me-3 rounded-pill"><i
                                                                            className="bi bi-discord"></i></button>
                                                                        <button style={{
                                                                            backgroundColor: "#26a7de",
                                                                            color: "#fff"
                                                                        }} className="btn me-3 rounded-pill"><i
                                                                            className="bi bi-twitter"></i></button>
                                                                        <button style={{
                                                                            backgroundColor: "#DB4437",
                                                                            color: "#fff"
                                                                        }} className="btn me-3 rounded-pill"><i
                                                                            className="bi bi-google"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="exampleFormControlInput1">YouTube Link (must me a link to your channel)</label>
                                                                    <input value={youtubeLink}
                                                                           onChange={e => setYoutubeLink(e.target.value)}
                                                                           type="text" className="form-control mt-2"
                                                                           id="exampleFormControlInput1"
                                                                           placeholder="https://www.youtube.com/"/>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="exampleFormControlInput1">Behance Link</label>
                                                                    <input value={behanceLink}
                                                                           onChange={e => setBehanceLink(e.target.value)}
                                                                           type="text" className="form-control mt-2"
                                                                           id="exampleFormControlInput1"
                                                                           placeholder="https://www.behance.com/username"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <label
                                                                htmlFor="exampleFormControlTextarea1">Biography</label>
                                                            <textarea value={biography}
                                                                      onChange={e => setBiography(e.target.value)}
                                                                      className="form-control mt-2"
                                                                      id="exampleFormControlTextarea1"
                                                                      placeholder="I like to..." rows={10}></textarea>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <button className="btn btn-primary float-end rounded-pill"
                                                                    onClick={updateProfile}>Update</button>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer/>
                </div>
            </div>
        </>
    );
}