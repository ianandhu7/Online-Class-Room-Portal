import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AssignmentSubmit = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submissionText, setSubmissionText] = useState('');
    const [files, setFiles] = useState([]); // We will handle single file for now based on backend
    const [status, setStatus] = useState('Assigned');

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const { getAssignment } = await import('../../api/assignments');
                const data = await getAssignment(id);
                setAssignment(data);

                if (data.submissions?.length > 0) {
                    setStatus(data.submissions[0].grade !== null ? 'Graded' : 'Submitted');
                    setSubmissionText(data.submissions[0].content || '');
                } else {
                    setStatus('Assigned');
                }
            } catch (error) {
                console.error("Failed to fetch assignment", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id]);

    const handleSubmit = async () => {
        if (!submissionText && files.length === 0) {
            alert("Please provide either a response or a file.");
            return;
        }

        setLoading(true);
        try {
            const { submitAssignment } = await import('../../api/assignments');

            const formData = new FormData();
            formData.append('content', submissionText);
            if (files.length > 0) {
                formData.append('attachment', files[0]);
            }

            await submitAssignment(id, formData);
            setStatus('Submitted');
            alert("Work submitted successfully!");
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit work.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFiles([e.target.files[0]]);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!assignment) return <div className="p-10 text-center">Assignment not found.</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/assignments')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-tight">{assignment.classroom?.course?.title || assignment.classroom?.name}</h1>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Assignment Details</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 lg:p-10 flex flex-col md:flex-row gap-6">

                {/* Left: Assignment Content */}
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">assignment</span>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{assignment.title}</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    {assignment.classroom?.teacher?.name || 'Classroom Portal'} • <span className="font-medium text-slate-700 dark:text-slate-300">{assignment.points} points</span> • Due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No due date'}
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-6"></div>

                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p className="whitespace-pre-wrap">{assignment.description}</p>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {assignment.attachments.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {assignment.attachments.map((file, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                                    <div className="size-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{file.name}</p>
                                        <p className="text-xs text-slate-500">{file.type.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

                    {/* Work Submission Text */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Your Response</h3>
                        <textarea
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            disabled={status !== 'Assigned'}
                            className="w-full min-h-[200px] p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder-slate-400 resize-y transition-all"
                            placeholder="Type your response here..."
                        ></textarea>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold mb-4">
                            <span className="material-symbols-outlined">group</span>
                            <h3>Class Comments</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="size-8 rounded-full bg-cover bg-slate-200 shrink-0" style={{ backgroundImage: `url("${user?.photoUrl}")` }}></div>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Add class comment..."
                                    className="w-full h-10 pl-4 pr-10 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary rounded-full transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Submission Panel */}
                <div className="w-full md:w-80 lg:w-96 shrink-0 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Your work</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}`}>
                                {status}
                            </span>
                        </div>

                        {/* Files List */}
                        {files.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-400">description</span>
                                        <span className="text-sm truncate flex-1">{f.name}</span>
                                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-4 text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                <p className="text-sm text-slate-500">No files attached</p>
                            </div>
                        )}

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={status !== 'Assigned'}
                        />
                        <button
                            onClick={() => document.getElementById('file-upload').click()}
                            disabled={status !== 'Assigned'}
                            className="w-full h-10 mb-3 bg-white dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span> {files.length > 0 ? 'Change file' : 'Add or create'}
                        </button>

                        <button onClick={handleSubmit} disabled={loading || status !== 'Assigned'} className="w-full h-10 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 transition-colors">
                            {loading ? 'Submitting...' : (status === 'Submitted' || status === 'Graded' ? status : 'Turn in')}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            <h3>Private comments</h3>
                        </div>
                        <div className="relative">
                            <textarea
                                placeholder="Add private comment to teacher..."
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                                rows="3"
                            ></textarea>
                            <button className="absolute right-2 bottom-2 p-1.5 text-slate-400 hover:text-primary rounded-full transition-colors">
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssignmentSubmit;
