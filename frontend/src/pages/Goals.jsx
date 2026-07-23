import { useEffect, useState } from "react";

import GoalHeader from "../components/goals/GoalHeader";
import GoalCard from "../components/goals/GoalCard";
import GoalProgress from "../components/goals/GoalProgress";
import GoalForm from "../components/goals/GoalForm";
import { SkeletonCards } from "../components/common/Skeleton";
import SkeletonCard from "../components/common/Skeleton";

import { getGoal, createGoal, updateGoal } from "../services/goalService";
import { getCache } from "../utils/cache";

const Goals = () => {
    const [goal, setGoal] = useState(() => getCache("goals")?.goal || null);
    const [loading, setLoading] = useState(!getCache("goals"));

    const fetchGoal = async (signal) => {
        try {
            const res = await getGoal(signal);
            setGoal(res.goal);
        } catch (error) {
            if (error.name === "CanceledError" || error.name === "AbortError") return;
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchGoal(controller.signal);
        return () => controller.abort();
    }, []);

    const handleCreate = async (data) => {
        await createGoal(data);
        fetchGoal();
    };

    const handleUpdate = async (savedAmount) => {
        await updateGoal(savedAmount);
        fetchGoal();
    };

    return (
        <>
            <GoalHeader />
            {loading ? (
                <div className="space-y-8">
                    <SkeletonCards count={2} height="h-48" />
                    <SkeletonCard className="h-48" />
                </div>
            ) : (
                <>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <GoalCard goal={goal} />
                        <GoalProgress goal={goal} />
                    </div>
                    <div className="mt-8">
                        <GoalForm goal={goal} onCreate={handleCreate} onUpdate={handleUpdate} />
                    </div>
                </>
            )}
        </>
    );
};

export default Goals;
