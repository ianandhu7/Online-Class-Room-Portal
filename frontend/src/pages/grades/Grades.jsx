import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getGrades, postGrade } from '../../api/grading';
import { getClassrooms } from '../../api/teacher';
import client from '../../api/client';

const Grades = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // For teacher: adding a grade
    const [gradeForm, setGradeForm] = useState({
        user: '',
        classroom: '',
        title: '',
        score: '',
        max_score: 100,
        grade_letter: ''
    });
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [gradesData, classroomsData] = await Promise.all([
                getGrades(),
                user.role === 'teacher' ? getClassrooms() : Promise.resolve([])
            ]);
            setGrades(gradesData);
            setClassrooms(classroomsData);
            if (classroomsData.length > 0) {
                setGradeForm(prev => ({ ...prev, classroom: classroomsData[0].id }));
            }
        } catch (error) {
            console.error("Failed to fetch grades data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassroomChange = async (classId) => {
        setGradeForm({ ...gradeForm, classroom: classId });
        try {
            const response = await client.get(`/classrooms/${classId}`);
            if (response.data.enrollments) {
                setStudents(response.data.enrollments.map(e => e.user_detail || { id: e.user, name: 'Student ' + e.user }));
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handlePostGrade = async (e) => {
        e.preventDefault();
        try {
            await postGrade(gradeForm);
            setIsAddModalOpen(false);
            fetchData();
            alert("Grade posted successfully!");
        } catch (error) {
            console.error("Failed to post grade", error);
            alert("Failed to post grade.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Gradebook...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 font-display transition-colors">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Gradebook</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage and view academic performance records.</p>
                    </div>
                    {user.role === 'teacher' && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">add_task</span>
                            Add Grade
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Assessment</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Grade</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {grades.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {g.user_name?.charAt(0) || 'S'}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{g.user_name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-slate-600 dark:text-slate-400 font-medium">{g.title}</td>
                                        <td className="px-8 py-5 font-black text-slate-900 dark:text-white">
                                            {g.score} <span className="text-slate-400 font-medium">/ {g.max_score}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${g.grade_letter?.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                                    g.grade_letter?.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {g.grade_letter || '-'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{new Date(g.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {grades.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center opacity-50">
                                            <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
                                            <p className="font-medium">No grade records found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stat Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">trending_up</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Class Average</p>
                            <h4 className="text-3xl font-black dark:text-white">88.4%</h4>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">emoji_events</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Top Grade</p>
                            <h4 className="text-3xl font-black dark:text-white">A+</h4>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Records</p>
                            <h4 className="text-3xl font-black dark:text-white">{grades.length}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Grade Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-hidden">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-2xl font-black tracking-tight dark:text-white">Record New Grade</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handlePostGrade} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Classroom</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold appearance-none"
                                        value={gradeForm.classroom}
                                        onChange={(e) => handleClassroomChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {classrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Student</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold appearance-none"
                                        value={gradeForm.user}
                                        onChange={(e) => setGradeForm({ ...gradeForm, user: e.target.value })}
                                        required
                                        disabled={!gradeForm.classroom}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Assessment Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Unit 1 Final, Pop Quiz"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold"
                                    value={gradeForm.title}
                                    onChange={(e) => setGradeForm({ ...gradeForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Score</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold"
                                        value={gradeForm.score}
                                        onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Max</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold"
                                        value={gradeForm.max_score}
                                        onChange={(e) => setGradeForm({ ...gradeForm, max_score: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Letter</label>
                                    <input
                                        type="text"
                                        placeholder="A, B+"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 dark:text-white text-sm font-bold uppercase"
                                        value={gradeForm.grade_letter}
                                        onChange={(e) => setGradeForm({ ...gradeForm, grade_letter: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-primary text-white font-black rounded-3xl mt-6 hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <span className="material-symbols-outlined">save</span>
                                Update Gradebook
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grades;
