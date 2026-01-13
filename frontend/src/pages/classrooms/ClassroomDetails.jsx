import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClassroomDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stream');

    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const { getClassroom, getAnnouncements } = await import('../../api/classrooms');
                const data = await getClassroom(id);

                // Fetch announcements
                let announcementsData = [];
                try {
                    announcementsData = await getAnnouncements(id);
                    setAnnouncements(announcementsData);
                } catch (error) {
                    console.log("No announcements or error fetching announcements", error);
                }

                // Combine assignments and announcements into stream
                const assignmentItems = (data.assignments || []).map(a => ({
                    id: a.id,
                    type: 'assignment',
                    title: a.title,
                    date: new Date(a.createdAt),
                    dateStr: new Date(a.createdAt).toLocaleDateString(),
                    author: data.teacher?.name
                }));

                const announcementItems = announcementsData.map(ann => ({
                    id: ann.id,
                    type: 'announcement',
                    title: ann.title,
                    content: ann.content,
                    date: new Date(ann.createdAt),
                    dateStr: new Date(ann.createdAt).toLocaleDateString(),
                    author: ann.author?.name || data.teacher?.name
                }));

                // Combine and sort by date (newest first)
                const combinedStream = [...assignmentItems, ...announcementItems].sort((a, b) => b.date - a.date);

                // Map data to UI needs
                const formatted = {
                    ...data,
                    bgImage: data.bannerUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
                    stream: combinedStream
                };
                setClassroom(formatted);
            } catch (error) {
                console.error("Failed to load classroom", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClassroom();
    }, [id]);

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementTitle.trim() && !announcementContent.trim()) {
            alert("Please provide at least a title or content for the announcement.");
            return;
        }

        setSubmitting(true);
        try {
            const { createAnnouncement } = await import('../../api/classrooms');
            await createAnnouncement({
                classroom: id,
                title: announcementTitle,
                content: announcementContent
            });

            // Reset form
            setAnnouncementTitle('');
            setAnnouncementContent('');
            setIsAnnouncementModalOpen(false);

            // Refresh classroom data
            const { getClassroom, getAnnouncements } = await import('../../api/classrooms');
            const data = await getClassroom(id);
            const announcementsData = await getAnnouncements(id);
            setAnnouncements(announcementsData);

            // Recombine stream
            const assignmentItems = (data.assignments || []).map(a => ({
                id: a.id,
                type: 'assignment',
                title: a.title,
                date: new Date(a.createdAt),
                dateStr: new Date(a.createdAt).toLocaleDateString(),
                author: data.teacher?.name
            }));

            const announcementItems = announcementsData.map(ann => ({
                id: ann.id,
                type: 'announcement',
                title: ann.title,
                content: ann.content,
                date: new Date(ann.createdAt),
                dateStr: new Date(ann.createdAt).toLocaleDateString(),
                author: ann.author?.name || data.teacher?.name
            }));

            const combinedStream = [...assignmentItems, ...announcementItems].sort((a, b) => b.date - a.date);
            setClassroom({ ...data, bgImage: data.bannerUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80', stream: combinedStream });

        } catch (error) {
            console.error("Failed to create announcement", error);
            alert("Failed to create announcement. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading classroom details...</p>
        </div>
    );
    if (!classroom) return <div className="p-10 text-center">Classroom not found.</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/classrooms')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-tight">{classroom.name}</h1>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{classroom.section}</span>
                    </div>
                </div>

                {/* Tabs (Desktop) */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full">
                    {['stream', 'classwork', 'people', 'grades'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 h-full text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <div className="size-9 bg-slate-200 rounded-full bg-cover" style={{ backgroundImage: `url("${user?.photoUrl}")` }}></div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">

                {/* Hero Banner */}
                {activeTab === 'stream' && (
                    <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${classroom.bgImage}")` }}></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">{classroom.name}</h2>
                            <p className="text-xl opacity-90">{classroom.section}</p>
                        </div>
                        <button className="absolute bottom-4 right-4 p-2 text-white/80 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[20px]">palette</span>
                            <span className="hidden sm:inline">Customize</span>
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Sidebar (Upcoming) - Only on Stream */}
                    {activeTab === 'stream' && (
                        <aside className="w-full md:w-64 shrink-0 space-y-4">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Upcoming</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Woohoo, no work due soon!</p>
                                <button className="mt-4 w-full text-right text-xs font-semibold text-primary hover:underline">View all</button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Class Code</h3>
                                    <button className="text-primary hover:bg-primary/10 p-1 rounded"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
                                </div>
                                <p className="text-xl font-bold text-primary tracking-wider">{classroom.code}</p>
                            </div>
                        </aside>
                    )}

                    {/* Main Feed */}
                    <div className="flex-1 space-y-4">
                        {activeTab === 'stream' && (
                            <>
                                {/* Announcement Input */}
                                {(user.role === 'teacher' || user.role === 'admin') && (
                                    <div
                                        onClick={() => setIsAnnouncementModalOpen(true)}
                                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow group"
                                    >
                                        <div className="size-10 rounded-full bg-slate-200 bg-cover" style={{ backgroundImage: `url("${user?.photoUrl}")` }}></div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Announce something to your class...</p>
                                    </div>
                                )}

                                {/* Stream Posts */}
                                {classroom.stream.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                                        <p className="text-slate-500">No posts in the stream yet.</p>
                                    </div>
                                ) : classroom.stream.map(post => (
                                    <div
                                        key={`${post.type}-${post.id}`}
                                        onClick={() => post.type === 'assignment' && navigate(`/assignments/${post.id}`)}
                                        className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors ${post.type === 'assignment' ? 'cursor-pointer' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center text-white ${post.type === 'assignment' ? 'bg-primary' : 'bg-emerald-500'}`}>
                                                <span className="material-symbols-outlined text-[20px]">{post.type === 'assignment' ? 'assignment' : 'campaign'}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                            {post.type === 'assignment' ? `${post.author || 'Teacher'} posted a new assignment: ${post.title}` : post.author}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{post.dateStr}</p>
                                                    </div>
                                                </div>
                                                {post.type === 'announcement' && post.title && (
                                                    <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{post.title}</h3>
                                                )}
                                                {post.content && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {activeTab === 'classwork' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Classwork</h2>
                                    {(user.role === 'teacher' || user.role === 'admin') && (
                                        <button onClick={() => navigate('/assignments/create')} className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-blue-600 transition-all flex items-center gap-2">
                                            <span className="material-symbols-outlined">add</span> Create
                                        </button>
                                    )}
                                </div>
                                {classroom.assignments?.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <span className="material-symbols-outlined text-4xl">assignment</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No assignments yet</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-2">Classwork helps you track progress</p>
                                    </div>
                                ) : classroom.assignments.map(a => (
                                    <div key={a.id} onClick={() => navigate(`/assignments/${a.id}`)} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer">
                                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">assignment</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{a.title}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Posted {new Date(a.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {a.dueDate && (
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Due</p>
                                                <p className="text-xs font-semibold">{new Date(a.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'people' && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-primary/20">
                                    <h2 className="text-2xl font-medium text-primary mb-4 flex justify-between items-center">
                                        Teachers
                                        {(user.role === 'teacher' || user.role === 'admin') && (
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-primary">
                                                <span className="material-symbols-outlined">person_add</span>
                                            </button>
                                        )}
                                    </h2>
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="size-10 rounded-full bg-cover bg-slate-200" style={{ backgroundImage: `url("${classroom.teacher?.photoUrl}")` }}></div>
                                        <span className="font-medium">{classroom.teacher?.name}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-medium text-primary mb-4 flex justify-between items-center">
                                        Students
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-normal text-slate-500">{classroom.enrollments?.length || 0} students</span>
                                            {(user.role === 'teacher' || user.role === 'admin') && (
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-primary">
                                                    <span className="material-symbols-outlined">person_add</span>
                                                </button>
                                            )}
                                        </div>
                                    </h2>
                                    <div className="space-y-4">
                                        {classroom.enrollments?.map(en => (
                                            <div key={en.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg -mx-2 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-full bg-cover bg-slate-200" style={{ backgroundImage: `url("${en.user?.photoUrl}")` }}></div>
                                                    <span className="font-medium">{en.user?.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">Create Announcement</h3>
                            <button
                                onClick={() => setIsAnnouncementModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-500">Title (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Announcement title..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-500">Content</label>
                                <textarea
                                    placeholder="Share something with your class..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white resize-y min-h-[150px]"
                                    value={announcementContent}
                                    onChange={(e) => setAnnouncementContent(e.target.value)}
                                    rows="6"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAnnouncementModalOpen(false)}
                                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomDetails;
