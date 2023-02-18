import DashboardSideNav from "@/components/DashboardSideNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {createServerSupabaseClient, Session} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {GetServerSidePropsContext, NextApiRequest} from "next";
import {useEffect, useState} from "react";
import {Alert} from "reactstrap";

import {EditorState, convertToRaw, convertFromHTML, ContentState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import dynamic from "next/dynamic";
import {validate} from "validate.js";
import {useRouter} from "next/navigation";
import Link from "next/link";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), {ssr: false});

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
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

        const profile = await supabase.from("profiles").select().eq("id", session.user.id).single();
        if (profile.error) {
            throw profile.error;
        }
        const postings = await supabase.from("postings").select("title, slug").eq("profile_id", session.user.id);
        if (postings.error) {
            throw postings.error;
        }

        const userData = {profileData: profile.data, postingsData: postings.data};

        return {
            props: {
                userData
            }
        };
    } catch (err) {
        console.log(err);

        return {
            props: {}
        };
    }
}

interface PostingProps {
    title: string,
    id: number,
    slug: string
}

export default function Index({session, userData}: {
    session: Session, userData: {
        postingsData: PostingProps[];
    };
}) {

    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const onDismiss = () => setSuccessAlertVisible(false);

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [hidden, setHidden] = useState<boolean>(false);


    const [editorState, setEditorState] = useState<EditorState>(EditorState.createWithContent(ContentState.createFromText(
        "Start typing here ..."
    )));

    const onEditorStateChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    const submitPosting = async () => {
        try {

            const constraints = {
                title: {
                    presence: true,
                    length: {
                        minimum: 3,
                        maximum: 255
                    }
                }, position: {
                    presence: true,
                    length: {
                        minimum: 3,
                        maximum: 50
                    }
                }, body: {
                    presence: true,
                    length: {
                        minimum: 3,
                    }
                }
            };

            const newPosting = {
                user_id: user?.id,
                title, position, body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                hidden
            };

            const validationErrors = validate(newPosting, constraints);

            if (validationErrors) {
                setErrorAlertVisible(true);
                const values: string[] = Object.values(validationErrors);
                setErrorMessages(values);
                return;
            }

            const {data, error} = await supabase.from("postings").insert(newPosting).select("*").single();

            if (error || !data) {
                setErrorAlertVisible(true);
                setErrorMessages(["There was an error trying to create your posting. Please try again later. If this issue continues, please contact support."]);
                return;
            }

            const newPost = data as PostingProps;

            const slug = title.split(" ").join("-") + "-" + newPost.id;

            await updateSlugAfterInsert(newPost.id, slug);

            setSuccessAlertVisible(true);
            setSuccessMessage("Your posting has successfully been created and is now public to the world! Good luck!");

            setTitle("");
            setPosition("");
            setEditorState(EditorState.createWithContent(ContentState.createFromText(
                "Start typing here ..."
            )));

            router.refresh();
        } catch (err) {
            console.log(err);
            setErrorAlertVisible(true);
            setErrorMessages(["There was an error trying to create your posting. Please try again later. If this issue continues, please contact support."]);
        }

    };

    const updateSlugAfterInsert = async (id: number, slug: string) => {
        try {
            const {data, error} = await supabase
                .from("postings")
                .update({slug})
                .eq("id", id).eq("profile_id", user?.id);

            if (error) {
                console.log(error.message);
                setErrorAlertVisible(true);
                setErrorMessages(["There was an error trying to create your posting. Please try again later. If this issue continues, please contact support."]);
                return;
            }
        } catch (err) {
            console.log(err);
            setErrorAlertVisible(true);
            setErrorMessages(["There was an error trying to create your posting. Please try again later. If this issue continues, please contact support."]);
        }
    };

    useEffect(() => {
        if (successAlertVisible) {
            setTimeout(() => {
                setSuccessAlertVisible(false);
            }, 3500);
        } else if (errorAlertVisible) {
            setTimeout(() => {
                setErrorAlertVisible(false);
            }, 4500);
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
                            <div className="card mb-4 shadow">
                                <div className="card-header bg-primary">
                                    <i className="fas fa-table me-1"></i>
                                    My Staff Postings
                                </div>
                                <div className="card-body">
                                    <Alert color="success" isOpen={successAlertVisible} toggle={onDismiss}>
                                        Your staff posting has successfully been posted
                                    </Alert>
                                    <Alert color="danger" isOpen={errorAlertVisible} toggle={onDismiss}>
                                        {errorMessages.map(message => (<>{message} <br/></>))}
                                    </Alert>
                                    {loading ? <>
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-danger" role="status">
                                            </div>
                                        </div>
                                    </> : <>
                                        <div className="container pb-5">
                                            <div className="row">
                                                <div className="col-md-6 mt-3">
                                                    <h4 className="text-center fw-bold">All Postings</h4>
                                                    <div className="list-group shadow-sm">
                                                        {userData.postingsData.map(posting => (
                                                            <div key={posting.id}>
                                                                <Link key={posting.id}
                                                                      href={`/dashboard/staff-postings/${posting.slug}`}
                                                                      className="list-group-item list-group-item-action">{posting.title}
                                                                </Link>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-3">
                                                    <h4 className="text-center fw-bold">Create New Posting</h4>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <label htmlFor="exampleInputEmail1"
                                                                       className="form-label">Title</label>
                                                                <input placeholder="My Posting Title" type="text"
                                                                       className="form-control"
                                                                       id="exampleInputEmail1"
                                                                       value={title}
                                                                       onChange={e => setTitle(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <label htmlFor="exampleInputEmail1"
                                                                       className="form-label">Position</label>
                                                                <input placeholder="I am a ..." type="text"
                                                                       className="form-control"
                                                                       value={position}
                                                                       onChange={e => setPosition(e.target.value)}
                                                                       id="exampleInputEmail1"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <div className="mb-3 form-check">
                                                                <input checked={hidden}
                                                                       onChange={e => setHidden(e.target.checked)}
                                                                       type="checkbox" className="form-check-input"
                                                                       id="exampleCheck1"/>
                                                                <label className="form-check-label text-danger"
                                                                       htmlFor="exampleCheck1">Hidden
                                                                    )</label>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="exampleInputPassword1"
                                                                       className="form-label">Description</label>
                                                                <Editor editorState={editorState}
                                                                        onEditorStateChange={onEditorStateChange}
                                                                    // toolbar={
                                                                    //     {
                                                                    //         options: ["inline", "blockType", "fontSize", "fontFamily", "list", "textAlign", "colorPicker", "link", "embedded", "emoji", "image", "remove", "history"],
                                                                    //         // fontFamily: {
                                                                    //         //     options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                                                    //         //     className: undefined,
                                                                    //         //     component: undefined,
                                                                    //         //     dropdownClassName: undefined,
                                                                    //         // },
                                                                    //         list: {
                                                                    //             inDropdown: false,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             dropdownClassName: undefined,
                                                                    //             options: ["unordered", "ordered", "indent", "outdent"],
                                                                    //             //   unordered: { icon: unordered, className: undefined },
                                                                    //             //   ordered: { icon: ordered, className: undefined },
                                                                    //             //   indent: { icon: indent, className: undefined },
                                                                    //             //   outdent: { icon: outdent, className: undefined },
                                                                    //         },
                                                                    //         textAlign: {
                                                                    //             inDropdown: false,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             dropdownClassName: undefined,
                                                                    //             options: ["left", "center", "right", "justify"],
                                                                    //             //   left: { icon: left, className: undefined },
                                                                    //             //   center: { icon: center, className: undefined },
                                                                    //             //   right: { icon: right, className: undefined },
                                                                    //             //   justify: { icon: justify, className: undefined },
                                                                    //         },
                                                                    //         colorPicker: {
                                                                    //             //   icon: color,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             popupClassName: undefined,
                                                                    //             colors: ["rgb(97,189,109)", "rgb(26,188,156)", "rgb(84,172,210)", "rgb(44,130,201)",
                                                                    //                 "rgb(147,101,184)", "rgb(71,85,119)", "rgb(204,204,204)", "rgb(65,168,95)", "rgb(0,168,133)",
                                                                    //                 "rgb(61,142,185)", "rgb(41,105,176)", "rgb(85,57,130)", "rgb(40,50,78)", "rgb(0,0,0)",
                                                                    //                 "rgb(247,218,100)", "rgb(251,160,38)", "rgb(235,107,86)", "rgb(226,80,65)", "rgb(163,143,132)",
                                                                    //                 "rgb(239,239,239)", "rgb(255,255,255)", "rgb(250,197,28)", "rgb(243,121,52)", "rgb(209,72,65)",
                                                                    //                 "rgb(184,49,47)", "rgb(124,112,107)", "rgb(209,213,216)"],
                                                                    //         },
                                                                    //         link: {
                                                                    //             inDropdown: false,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             popupClassName: undefined,
                                                                    //             dropdownClassName: undefined,
                                                                    //             showOpenOptionOnHover: true,
                                                                    //             defaultTargetOption: "_self",
                                                                    //             options: ["link", "unlink"],
                                                                    //             //   link: { icon: link, className: undefined },
                                                                    //             //   unlink: { icon: unlink, className: undefined },
                                                                    //             linkCallback: undefined
                                                                    //         },
                                                                    //         emoji: {
                                                                    //             //   icon: emoji,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             popupClassName: undefined,
                                                                    //             emojis: [
                                                                    //                 "😀", "😁", "😂", "😃", "😉", "😋", "😎", "😍", "😗", "🤗", "🤔", "😣", "😫", "😴", "😌", "🤓",
                                                                    //                 "😛", "😜", "😠", "😇", "😷", "😈", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "🙈",
                                                                    //                 "🙉", "🙊", "👼", "👮", "🕵", "💂", "👳", "🎅", "👸", "👰", "👲", "🙍", "🙇", "🚶", "🏃", "💃",
                                                                    //                 "⛷", "🏂", "🏌", "🏄", "🚣", "🏊", "⛹", "🏋", "🚴", "👫", "💪", "👈", "👉", "👉", "👆", "🖕",
                                                                    //                 "👇", "🖖", "🤘", "🖐", "👌", "👍", "👎", "✊", "👊", "👏", "🙌", "🙏", "🐵", "🐶", "🐇", "🐥",
                                                                    //                 "🐸", "🐌", "🐛", "🐜", "🐝", "🍉", "🍄", "🍔", "🍤", "🍨", "🍪", "🎂", "🍰", "🍾", "🍷", "🍸",
                                                                    //                 "🍺", "🌍", "🚑", "⏰", "🌙", "🌝", "🌞", "⭐", "🌟", "🌠", "🌨", "🌩", "⛄", "🔥", "🎄", "🎈",
                                                                    //                 "🎉", "🎊", "🎁", "🎗", "🏀", "🏈", "🎲", "🔇", "🔈", "📣", "🔔", "🎵", "🎷", "💰", "🖊", "📅",
                                                                    //                 "✅", "❎", "💯",
                                                                    //             ],
                                                                    //         },
                                                                    //         // remove: { icon: eraser, className: undefined, component: undefined },
                                                                    //         history: {
                                                                    //             inDropdown: false,
                                                                    //             className: undefined,
                                                                    //             component: undefined,
                                                                    //             dropdownClassName: undefined,
                                                                    //             options: ["undo", "redo"],
                                                                    //             // undo: { icon: undo, className: undefined },
                                                                    //             // redo: { icon: redo, className: undefined },
                                                                    //         },
                                                                    //     }
                                                                    // }
                                                                />
                                                                {/* <textarea
                                                                    disabled
                                                                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                                                /> */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button type="submit"
                                                            onClick={submitPosting}
                                                            className="btn btn-primary rounded-pill">Submit
                                                    </button>
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