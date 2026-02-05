'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EmployeeLayout from '@/components/layout/employee-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  purpose?: string;
  description?: string;
  memberCount: number;
  createdBy: { name: string };
}

export default function EmployeeTeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(data.teams || []);
        setMyTeams(data.myTeams || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchTeams();
    }
  }, [session]);

  const joinTeam = async (teamId: string) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/join`, { method: 'POST' });
      if (res.ok) {
        // Refresh teams
        const teamsRes = await fetch('/api/teams');
        const data = await teamsRes.json();
        setMyTeams(data.myTeams || []);
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading teams...</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Teams & Groups
        </h1>

        {/* My Teams */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            My Teams
          </h2>
          {myTeams.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                You haven't joined any teams yet. Explore teams below to get started!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeams.map((team) => (
                <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  {team.purpose && (
                    <p className="text-sm text-gray-600 mt-2">{team.purpose}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">
                      {team.memberCount} members
                    </Badge>
                    <Link
                      href={`/dashboard/employee/teams/${team.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Explore Teams */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Explore Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams
              .filter((t) => !myTeams.find((mt) => mt.id === t.id))
              .map((team) => (
                <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  {team.purpose && (
                    <p className="text-sm text-gray-600 mt-2">{team.purpose}</p>
                  )}
                  {team.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">
                      {team.memberCount} members
                    </Badge>
                    <Button
                      onClick={() => joinTeam(team.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Join
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
