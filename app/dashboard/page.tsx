    "use client";

    import { useEffect, useState } from "react";
    import { supabase } from "@/lib/supabaseClient";
    import { useRouter } from "next/navigation";

    type Task = {
    id: string;
    title: string;
    resource_link: string | null;
    completed: boolean;
    created_at: string;
    };

    export default function Dashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(true);

    async function ensureLoggedIn() {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
        router.push("/");
        return null;
        }
        return data.user.id;
    }

    async function loadTasks() {
        const uid = await ensureLoggedIn();
        if (!uid) return;

        const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) {
        alert(error.message);
        return;
        }
        setTasks((data as Task[]) || []);
        setLoading(false);
    }

    async function addTask() {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) return router.push("/");

        if (!title.trim()) return alert("Enter a task title.");

        const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: title.trim(),
        resource_link: link.trim() || null,
        completed: false,
        });

        if (error) return alert(error.message);

        setTitle("");
        setLink("");
        await loadTasks();
    }

    async function toggleTask(id: string, completed: boolean) {
        const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
        if (error) return alert(error.message);
        await loadTasks();
    }

    async function deleteTask(id: string) {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) return alert(error.message);
        await loadTasks();
    }

    async function logout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <main className="min-h-screen p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">StudyFlow Dashboard</h1>
            <button className="border rounded-xl px-4 py-2" onClick={logout}>
            Logout
            </button>
        </div>

        <div className="mt-6 border rounded-2xl p-4">
            <h2 className="font-medium">Add Task</h2>
            <div className="mt-3 grid gap-3">
            <input
                className="border rounded-xl p-3"
                placeholder="Task title (e.g., Revise CN Unit 2)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                className="border rounded-xl p-3"
                placeholder="Resource link (optional)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <button className="bg-black text-white rounded-xl p-3" onClick={addTask}>
                Add
            </button>
            </div>
        </div>

        <div className="mt-6">
            <h2 className="font-medium mb-3">Your Tasks</h2>

            {loading ? (
            <p className="text-sm text-gray-600">Loading...</p>
            ) : (
            <div className="space-y-3">
                {tasks.map((t) => (
                <div key={t.id} className="border rounded-2xl p-4 flex justify-between gap-4">
                    <div>
                    <p className={`font-medium ${t.completed ? "line-through text-gray-500" : ""}`}>
                        {t.title}
                    </p>
                    {t.resource_link && (
                        <a className="text-sm underline" href={t.resource_link} target="_blank">
                        Resource
                        </a>
                    )}
                    </div>

                    <div className="flex items-center gap-2">
                    <button
                        className="border rounded-xl px-3 py-2"
                        onClick={() => toggleTask(t.id, !t.completed)}
                    >
                        {t.completed ? "Undo" : "Done"}
                    </button>
                    <button
                        className="border rounded-xl px-3 py-2"
                        onClick={() => deleteTask(t.id)}
                    >
                        Delete
                    </button>
                    </div>
                </div>
                ))}

                {tasks.length === 0 && (
                <p className="text-sm text-gray-600">No tasks yet. Add your first one above.</p>
                )}
            </div>
            )}
        </div>
        </main>
    );
    }
