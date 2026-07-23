import { useState, useEffect } from "react";

const GoalForm = ({
    goal,
    onCreate,
    onUpdate,
}) => {

    const [title, setTitle] = useState(goal?.title || "");

    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || "");

    const [savedAmount, setSavedAmount] = useState(goal?.savedAmount || "");

    useEffect(() => {
        if (goal) {
            setTitle(goal.title || "");
            setTargetAmount(goal.targetAmount || "");
            setSavedAmount(goal.savedAmount || "");
        }
    }, [goal]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!goal) {

            await onCreate({

                title,

                targetAmount,

            });

        }

        else {

            await onUpdate(savedAmount);

        }

    };

    return (

        <div className="bg-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">

                {goal ? "Update Goal" : "Create Goal"}

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {

                    !goal && (

                        <>

                            <input
                                type="text"
                                placeholder="Goal Name"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="w-full p-3 rounded-lg bg-slate-700"
                                required
                            />

                            <input
                                type="number"
                                placeholder="Target Amount"
                                value={targetAmount}
                                onChange={(e) =>
                                    setTargetAmount(e.target.value)
                                }
                                className="w-full p-3 rounded-lg bg-slate-700"
                                required
                            />

                        </>

                    )

                }

                {

                    goal && (

                        <input
                            type="number"
                            placeholder="Saved Amount"
                            value={savedAmount}
                            onChange={(e) =>
                                setSavedAmount(e.target.value)
                            }
                            className="w-full p-3 rounded-lg bg-slate-700"
                            required
                        />

                    )

                }

                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold"
                >

                    {goal ? "Update Savings" : "Create Goal"}

                </button>

            </form>

        </div>

    );

};

export default GoalForm;