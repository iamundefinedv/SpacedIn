import DashboardSideNav from "@/components/DashboardSideNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {createServerSupabaseClient, Session} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {GetServerSidePropsContext, NextApiRequest} from "next";
import {use, useEffect, useState} from "react";
import {Alert} from "reactstrap";
import {ContentState, convertFromHTML, convertFromRaw, convertToRaw, EditorState, RawDraftContentState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";

const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), {ssr: false});
let htmlToDraft: any = null;
if (typeof window === "object") {
    htmlToDraft = require("html-to-draftjs").default;
}

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

    const slug = context.params?.slug;

    const {
        data,
        error,
        status
    } = await supabase.from("postings").select("*").eq("slug", slug).eq("profile_id", session.user.id).single();

    if (error) {
        return {
            redirect: {
                destination: "/dashboard/staff-postings",
                permanent: false,
            },
        };
    }

    return {
        props: {
            data
        }
    };
}

export default function Posting({session, data}: { session: Session, data: any; }) {

    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const onDismiss = () => setSuccessAlertVisible(false);

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState<string>(data.title);
    const [body, setBody] = useState<string>(data.body);
    const [position, setPosition] = useState<string>(data.position);

    const [hidden, setHidden] = useState<boolean>(data.hidden);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [defaultEditorState, setDefaultEditorState] = useState<EditorState>(EditorState.createEmpty());

    const onEditorStateChange = (newState: EditorState) => {
        setEditorState(newState);
    };
    const updatePosting = async () => {
        try {
            const {error} = await supabase.from("postings").update({
                title, body, position, hidden, updated_at: new Date().toISOString()
            }).eq("id", data.id).eq("profile_id", user?.id);

            if (error) {
                setErrorAlertVisible(true);
                setErrorMessage(error.message);
                return;
            }

            setSuccessAlertVisible(true);
            setSuccessMessage("Successfully updated your Staff Posting");

        } catch (err) {
            setErrorAlertVisible(true);
            console.log(err);
            setErrorMessage("There was an error updating your post, please try again later.");
        }

    };

    useEffect(() => {
        const contentBlocks = htmlToDraft(data.body);
        const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks, contentBlocks.entityMap);
        setEditorState(EditorState.createWithContent(contentState));
    }, []);

    useEffect(() => {
        if (successAlertVisible) {
            setTimeout(() => {
                setSuccessAlertVisible(false);
                // router.refresh();
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
                                    <i className="bi bi-arrow-left me-2"></i>
                                    {title}
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
                                                                    </label>
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
                                                        <div className="form-group mt-3">
                                                            <button className="btn btn-primary float-end rounded-pill"
                                                                    onClick={updatePosting}
                                                            >Update</button>
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