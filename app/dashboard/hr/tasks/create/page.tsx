'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle2 } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  eventId?: string;
  projectId?: string;
  event?: {
    title: string;
  };
  project?: {
    title: string;
  };
}

interface FormData {
  teamId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export default function CreateTaskPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdTasks, setCreatedTasks] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    teamId: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchTeams();
    }
  }, [session]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamId || !formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in team and title fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/teams/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: formData.teamId,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedTasks([...createdTasks, data.task.id]);
        
        toast({
          title: 'Success!',
          description: `Task created and assigned to ${data.assignments.length} team members`,
        });

        // Reset form
        setFormData({
          teamId: formData.teamId, // Keep same team selected
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: '',
        });
      } else {
        const error = await res.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create task',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTeam = teams.find((t) => t.id === formData.teamId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Create Team Tasks
          </h1>
          <p className="text-lg text-slate-600">
            Create tasks for your teams and assign them to members
          </p>
        </div>

        {createdTasks.length > 0 && (
          <Alert className="mb-8 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ {createdTasks.length} task(s) created successfully! All team members have been notified.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-2 border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Select Team *
                  </label>
                  <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                          {team.event && ` (Event: ${team.event.title})`}
                          {team.project && ` (Project: ${team.project.title})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teams.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      No teams found. Create teams first.
                    </p>
                  )}
                </div>

                {/* Task Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Task Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Prepare presentation slides"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="Provide detailed instructions for the task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32 text-base"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Priority
                  </label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Due Date (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting || teams.length === 0}
                  className="w-full h-12 text-base bg-amber-500 hover:bg-amber-600"
                >
                  {submitting ? (
                    'Creating task...'
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Team Info Sidebar */}
          {selectedTeam && (
            <Card className="p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white sticky top-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Team Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-semibold">TEAM NAME</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {selectedTeam.name}
                  </p>
                </div>
                
                {selectedTeam.event && (
                  <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold">RELATED EVENT</p>
                    <p className="text-sm font-medium text-purple-900 mt-1">
                      {selectedTeam.event.title}
                    </p>
                  </div>
                )}
                
                {selectedTeam.project && (
                  <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">RELATED PROJECT</p>
                    <p className="text-sm font-medium text-blue-900 mt-1">
                      {selectedTeam.project.title}
                    </p>
                  </div>
                )}

                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-800">
                    ℹ️ Tasks will be automatically assigned to all team members and they can start submitting their work immediately.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
