"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Crown,
  UserMinus,
  Settings,
  Copy,
  Check,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  avatar?: string;
}

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "jnishit91@gmail.com",
    role: "owner",
    joinedAt: new Date().toISOString(),
  },
];

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> =
  {
    owner: {
      bg: "bg-accent-amber/10",
      text: "text-accent-amber",
      label: "Owner",
    },
    admin: {
      bg: "bg-brand-600/10",
      text: "text-brand-400",
      label: "Admin",
    },
    member: {
      bg: "bg-surface-800",
      text: "text-surface-400",
      label: "Member",
    },
  };

export default function TeamsPage() {
  const [members] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [copied, setCopied] = useState(false);

  const teamId = "team_wollnut_default";

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteEmail("");
    setShowInvite(false);
  };

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(
      `https://wollnutlabs.com/invite/${teamId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="mt-1 text-sm text-surface-400">
            Manage your team members and permissions
          </p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Team stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500">
            Members
          </p>
          <p className="mt-1 text-2xl font-bold text-white">
            {members.length}
          </p>
        </div>
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500">
            Plan
          </p>
          <p className="mt-1 text-2xl font-bold text-white">Starter</p>
          <p className="text-xs text-surface-500">Up to 5 members</p>
        </div>
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500">
            Shared Credits
          </p>
          <p className="mt-1 text-2xl font-bold text-accent-green">Enabled</p>
        </div>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">
            Invite Team Member
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Email Address
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="block flex-1 rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                  placeholder="colleague@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Role
              </label>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setInviteRole("member")}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    inviteRole === "member"
                      ? "border-brand-500 bg-brand-600/10"
                      : "border-surface-700 bg-surface-800/50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${inviteRole === "member" ? "text-brand-400" : "text-surface-300"}`}
                  >
                    Member
                  </p>
                  <p className="text-xs text-surface-500">
                    Can create and manage their own instances
                  </p>
                </button>
                <button
                  onClick={() => setInviteRole("admin")}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    inviteRole === "admin"
                      ? "border-brand-500 bg-brand-600/10"
                      : "border-surface-700 bg-surface-800/50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${inviteRole === "admin" ? "text-brand-400" : "text-surface-300"}`}
                  >
                    Admin
                  </p>
                  <p className="text-xs text-surface-500">
                    Full access including billing and team settings
                  </p>
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                Send Invite
              </button>
              <button
                onClick={() => {
                  setShowInvite(false);
                  setInviteEmail("");
                }}
                className="rounded-lg border border-surface-700 px-4 py-2 text-sm font-medium text-surface-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Invite link */}
          <div className="mt-4 border-t border-surface-800 pt-4">
            <p className="text-xs font-medium text-surface-500">
              Or share an invite link
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-xs text-surface-400">
                https://wollnutlabs.com/invite/{teamId}
              </code>
              <button
                onClick={copyInviteLink}
                className="rounded-lg bg-surface-800 p-2 text-surface-400 hover:text-white"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent-green" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="mt-6 space-y-2">
        <div className="px-1 text-xs font-medium uppercase tracking-wider text-surface-500">
          Members ({members.length})
        </div>
        {members.map((member) => {
          const roleStyle = ROLE_STYLES[member.role];
          return (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-surface-800 bg-surface-900 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {member.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${roleStyle.bg} ${roleStyle.text}`}
                    >
                      {member.role === "owner" && (
                        <Crown className="mr-0.5 inline h-3 w-3" />
                      )}
                      {roleStyle.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-surface-500">
                    {member.email}
                  </p>
                </div>
              </div>
              {member.role !== "owner" && (
                <div className="flex items-center gap-1">
                  <button
                    className="rounded-lg p-2 text-surface-500 hover:bg-surface-800 hover:text-white"
                    title="Change role"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-surface-500 hover:bg-accent-red/10 hover:text-accent-red"
                    title="Remove member"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-8 rounded-xl border border-surface-800 bg-surface-900/50 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Shield className="h-4 w-4 text-brand-400" />
          Team Permissions
        </div>
        <div className="mt-3 space-y-2 text-sm text-surface-400">
          <div className="flex items-start gap-2">
            <Crown className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent-amber" />
            <span>
              <strong className="text-surface-300">Owner</strong> — Full control
              including billing, team management, and all instances
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-400" />
            <span>
              <strong className="text-surface-300">Admin</strong> — Manage team
              members, view billing, and control all instances
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Users className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-surface-500" />
            <span>
              <strong className="text-surface-300">Member</strong> — Create and
              manage their own instances, view shared resources
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
