import DashboardSideNav from "@/components/DashboardSideNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createServerSupabaseClient, Session } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { useEffect, useState } from "react";
import { Alert } from "reactstrap";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createServerSupabaseClient(context);

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

    return {
        props: {
            data
        }
    };
}

export default function Applications({ session, data }: { session: Session, data: any; }) {

    const supabase = useSupabaseClient();
    const user = useUser();

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);

    const onDismiss = () => setSuccessAlertVisible(false);

    const [loading, setLoading] = useState(false);

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
            <Navbar dashboard={true} />
            <div id="layoutSidenav">
                <DashboardSideNav profile={true} />
                <div id="layoutSidenav_content">
                    <main id="profile-settings">
                        <div className="container-fluid px-4 mt-3">
                            <div className="card mb-4">
                                <div className="card-header bg-primary">
                                    <i className="fas fa-table me-1"></i>
                                    My Applications
                                </div>
                                <div className="card-body">
                                    <Alert color='success' isOpen={successAlertVisible} toggle={onDismiss}>
                                        Your profile has successfully been updated
                                    </Alert>
                                    <Alert color='danger' isOpen={errorAlertVisible} toggle={onDismiss}>
                                        There was an error updating your profile. Please try again later.
                                    </Alert>

                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}