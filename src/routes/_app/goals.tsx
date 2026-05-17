import React, { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, CheckCircle2, Lock, Plus, RotateCcw, Save, Scale, Target } from "lucide-react";

import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";

type GoalStatus = "Pending Approval" | "Approved" | "Rejected";
type GoalStatusFilter = GoalStatus | "All";
type CheckInStatus = "On Track" | "Completed";

interface CheckInDraft {
  actualProgress: string;
  checkInStatus: CheckInStatus;
}

interface Goal {
  id: string;
  title: string;
  target: string;
  weightage: number;
  status: GoalStatus;
  actualProgress?: number;
  checkInStatus?: CheckInStatus;
  lastCheckInAt?: string;
}

const emptyForm = {
  title: "",
  target: "",
  weightage: "",
};

const statusStyles: Record<GoalStatus, string> = {
  "Pending Approval": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Rejected: "border-red-400/30 bg-red-400/10 text-red-200",
};

const darkFieldClass =
  "w-full rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30";

export const Route = createFileRoute("/_app/goals")({
  component: GoalsPage,
});

function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GoalStatusFilter>("Pending Approval");
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);
  const [savingCheckInGoalId, setSavingCheckInGoalId] = useState<string | null>(null);
  const [checkInDrafts, setCheckInDrafts] = useState<Record<string, CheckInDraft>>({});

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  const fetchGoals = async () => {
    const snapshot = await getDocs(collection(db, "goals"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Goal, "id">),
    }));
    setGoals(data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalWeightage = useMemo(() => goals.reduce((acc, g) => acc + g.weightage, 0), [goals]);
  const remainingWeightage = Math.max(100 - totalWeightage, 0);
  const pendingGoals = goals.filter((goal) => goal.status === "Pending Approval");
  const approvedGoals = goals.filter((goal) => goal.status === "Approved");
  const rejectedGoals = goals.filter((goal) => goal.status === "Rejected");
  const filteredGoals =
    activeFilter === "All" ? goals : goals.filter((goal) => goal.status === activeFilter);
  const checkInGoals = approvedGoals.length > 0 ? approvedGoals : goals;

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(formData.weightage);
    const title = formData.title.trim();
    const target = formData.target.trim();

    if (goals.length >= 8) return alert("Max 8 goals allowed");
    if (!title) return alert("Title is required");
    if (!target) return alert("Target is required");
    if (!Number.isFinite(weight) || weight <= 0) return alert("Weightage must be greater than 0");
    if (totalWeightage + weight > 100) {
      return alert(
        `Total weightage must be exactly 100%. You only have ${remainingWeightage}% remaining.`,
      );
    }
    if (goals.length === 7 && totalWeightage + weight !== 100) {
      return alert("The 8th goal must bring total weightage to exactly 100%.");
    }

    await addDoc(collection(db, "goals"), {
      title,
      target,
      weightage: weight,
      status: "Pending Approval",
    });

    setIsModalOpen(false);
    setFormData(emptyForm);

    fetchGoals();
  };

  const updateStatus = async (id: string, status: GoalStatus) => {
    setUpdatingGoalId(id);
    setGoals((currentGoals) =>
      currentGoals.map((goal) => (goal.id === id ? { ...goal, status } : goal)),
    );

    try {
      await updateDoc(doc(db, "goals", id), { status });
    } catch (error) {
      fetchGoals();
      alert("Could not update goal status. Please try again.");
      console.error(error);
    } finally {
      setUpdatingGoalId(null);
    }
  };

  const getCheckInDraft = (goal: Goal): CheckInDraft =>
    checkInDrafts[goal.id] ?? {
      actualProgress: String(goal.actualProgress ?? ""),
      checkInStatus: goal.checkInStatus ?? "On Track",
    };

  const updateCheckInDraft = (id: string, draft: Partial<CheckInDraft>) => {
    setCheckInDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        ...(currentDrafts[id] ?? {
          actualProgress: "",
          checkInStatus: "On Track",
        }),
        ...draft,
      },
    }));
  };

  const saveQuarterlyCheckIn = async (goal: Goal) => {
    const draft = getCheckInDraft(goal);
    const actualProgress = parseFloat(draft.actualProgress);

    if (!Number.isFinite(actualProgress) || actualProgress < 0 || actualProgress > 100) {
      return alert("Actual progress must be between 0 and 100.");
    }

    const checkInUpdate = {
      actualProgress,
      checkInStatus: draft.checkInStatus,
      lastCheckInAt: new Date().toISOString(),
    };

    setSavingCheckInGoalId(goal.id);
    setGoals((currentGoals) =>
      currentGoals.map((currentGoal) =>
        currentGoal.id === goal.id ? { ...currentGoal, ...checkInUpdate } : currentGoal,
      ),
    );

    try {
      await updateDoc(doc(db, "goals", goal.id), checkInUpdate);
    } catch (error) {
      fetchGoals();
      alert("Could not save quarterly check-in. Please try again.");
      console.error(error);
    } finally {
      setSavingCheckInGoalId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">AlignIQ Goals</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-white">
        <div className="bg-white/10 p-3 rounded">Weightage: {totalWeightage}% / 100%</div>
        <div className="bg-white/10 p-3 rounded">Goals: {goals.length} / 8</div>
        <div className="bg-white/10 p-3 rounded">
          {totalWeightage === 100 ? "Total complete" : `${remainingWeightage}% remaining`}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Quarterly check-ins</h2>
          <p className="text-sm text-white/60">
            Update actual progress and mark each goal as On Track or Completed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {checkInGoals.map((goal) => {
            const draft = getCheckInDraft(goal);

            return (
              <div key={goal.id} className="rounded bg-white/5 p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{goal.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex items-center gap-1">
                        <Target size={14} /> {goal.target}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Scale size={14} /> {goal.weightage}%
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    <CheckCircle2 size={13} /> {goal.checkInStatus ?? "On Track"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
                  <label className="space-y-1 text-sm">
                    <span className="text-white/60">Actual progress</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draft.actualProgress}
                      onChange={(e) =>
                        updateCheckInDraft(goal.id, { actualProgress: e.target.value })
                      }
                      className={darkFieldClass}
                      placeholder="0"
                    />
                  </label>

                  <label className="space-y-1 text-sm">
                    <span className="text-white/60">Status</span>
                    <select
                      value={draft.checkInStatus}
                      onChange={(e) =>
                        updateCheckInDraft(goal.id, {
                          checkInStatus: e.target.value as CheckInStatus,
                        })
                      }
                      className={darkFieldClass}
                    >
                      <option value="On Track">On Track</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded bg-white/10">
                    <div
                      className="h-full rounded bg-indigo-400"
                      style={{
                        width: `${Math.min(Math.max(Number(draft.actualProgress) || 0, 0), 100)}%`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => saveQuarterlyCheckIn(goal)}
                    disabled={savingCheckInGoalId === goal.id}
                    className="inline-flex items-center gap-1 rounded bg-indigo-500 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>

                {goal.lastCheckInAt && (
                  <div className="mt-2 text-xs text-white/50">
                    Last check-in: {new Date(goal.lastCheckInAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {checkInGoals.length === 0 && (
          <div className="rounded bg-white/5 p-6 text-center text-sm text-white/60">
            No goals available for quarterly check-ins yet.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Manager approval queue</h2>
            <p className="text-sm text-white/60">
              Review submitted goals and update each approval status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {(
              [
                ["Pending Approval", pendingGoals.length],
                ["Approved", approvedGoals.length],
                ["Rejected", rejectedGoals.length],
                ["All", goals.length],
              ] as Array<[GoalStatusFilter, number]>
            ).map(([status, count]) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                className={`rounded border px-3 py-1.5 transition ${
                  activeFilter === status
                    ? "border-indigo-300 bg-indigo-500 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredGoals.map((g) => (
            <div key={g.id} className="bg-white/5 p-4 rounded text-white">
              <div
                className={`inline-flex rounded border px-2 py-1 text-xs font-medium ${statusStyles[g.status]}`}
              >
                {g.status}
              </div>

              <h2 className="mt-3 font-bold">{g.title}</h2>

              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Target size={14} /> {g.target}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Scale size={14} /> {g.weightage}%
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <>
                  <button
                    onClick={() => updateStatus(g.id, "Approved")}
                    disabled={updatingGoalId === g.id || g.status === "Approved"}
                    className="inline-flex items-center gap-1 rounded bg-green-500/20 px-3 py-1 text-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check size={14} /> Approve
                  </button>

                  <button
                    onClick={() => updateStatus(g.id, "Rejected")}
                    disabled={updatingGoalId === g.id || g.status === "Rejected"}
                    className="inline-flex items-center gap-1 rounded bg-red-500/20 px-3 py-1 text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={14} /> Reject
                  </button>
                </>
                <span className="ml-auto flex items-center gap-1 text-sm text-white/50">
                  <Lock size={14} /> Status saved
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="rounded bg-white/5 p-6 text-center text-sm text-white/60">
            No goals in this approval status.
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={createGoal}
            className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-gray-900 p-6 text-white shadow-2xl"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">Create goal</h2>
              <p className="mt-1 text-sm text-gray-400">Add a goal for this cycle.</p>
            </div>

            <input
              placeholder="Title"
              className={darkFieldClass}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <input
              placeholder="Target"
              className={darkFieldClass}
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            />

            <input
              type="number"
              placeholder="Weightage"
              min="1"
              max={remainingWeightage || 100}
              className={darkFieldClass}
              value={formData.weightage}
              onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
            />

            <div className="rounded-md border border-white/10 bg-white/5 p-3 text-xs text-gray-300">
              Total must equal 100%. {remainingWeightage}% remaining across up to {8 - goals.length}{" "}
              goals.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-md bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400">
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
