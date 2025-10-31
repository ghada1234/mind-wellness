'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Activity,
  UserPlus,
  Clock
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where,
  Timestamp 
} from 'firebase/firestore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UserData {
  id: string;
  email: string;
  createdAt: Date;
  lastActive?: Date;
}

interface Stats {
  totalUsers: number;
  todayUsers: number;
  weekUsers: number;
  monthUsers: number;
  activeToday: number;
}

export default function AnalyticsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    todayUsers: 0,
    weekUsers: 0,
    monthUsers: 0,
    activeToday: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);

      // Get all users from Firestore
      // Note: User metadata is stored when users log in (via useUserTracking hook)
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      console.log('📊 Firestore users collection size:', usersSnapshot.size);
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let totalUsers = 0;
      let todayUsers = 0;
      let weekUsers = 0;
      let monthUsers = 0;
      let activeToday = 0;
      const users: UserData[] = [];

      usersSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          totalUsers++;

          // Handle Firestore Timestamp or Date objects
          let createdAt: Date;
          let lastActive: Date | undefined;

          if (data.createdAt) {
            createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt instanceof Date ? data.createdAt : new Date());
          } else {
            createdAt = new Date();
          }

          if (data.lastActive) {
            lastActive = data.lastActive?.toDate ? data.lastActive.toDate() : (data.lastActive instanceof Date ? data.lastActive : undefined);
          }

          users.push({
            id: doc.id,
            email: data.email || 'N/A',
            createdAt,
            lastActive
          });

          if (createdAt >= todayStart) todayUsers++;
          if (createdAt >= weekStart) weekUsers++;
          if (createdAt >= monthStart) monthUsers++;
          if (lastActive && lastActive >= todayStart) activeToday++;
        } catch (error) {
          console.error(`Error processing user ${doc.id}:`, error);
        }
      });

      setStats({
        totalUsers,
        todayUsers,
        weekUsers,
        monthUsers,
        activeToday
      });

      // Sort users by creation date (newest first)
      users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setRecentUsers(users.slice(0, 10));

      // Generate growth chart data for the last 30 days
      generateGrowthData(users);
      
      // Generate activity data
      generateActivityData();

    } catch (error) {
      console.error('Error fetching analytics:', error);
      // If users collection doesn't exist, show demo data
      setStats({
        totalUsers: 0,
        todayUsers: 0,
        weekUsers: 0,
        monthUsers: 0,
        activeToday: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const generateGrowthData = (users: UserData[]) => {
    const last30Days = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const usersOnDay = users.filter(
        u => u.createdAt >= dayStart && u.createdAt < dayEnd
      ).length;

      last30Days.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: usersOnDay,
        cumulative: users.filter(u => u.createdAt < dayEnd).length
      });
    }

    setGrowthData(last30Days);
  };

  const generateActivityData = async () => {
    try {
      // Get activity from different collections
      const collections_to_check = ['moods', 'journals', 'meditations', 'sleepLogs', 'waterIntake'];
      const activityCounts = [];

      for (const collectionName of collections_to_check) {
        const collRef = collection(db, collectionName);
        const snapshot = await getDocs(query(collRef, limit(1000)));
        
        activityCounts.push({
          name: collectionName.charAt(0).toUpperCase() + collectionName.slice(1),
          count: snapshot.size
        });
      }

      setActivityData(activityCounts);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <button
          onClick={fetchUserAnalytics}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Show helpful message if no users */}
      {stats.totalUsers === 0 && !loading && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              No Users Found
            </CardTitle>
            <CardDescription>
              Your analytics dashboard is ready, but there are no users yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <strong>Why you see zero:</strong>
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>No users have signed up yet, or</li>
              <li>Users haven't logged in after the tracking was added</li>
            </ul>
            <p className="text-sm">
              <strong>To see data:</strong>
            </p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Create a test account at <a href="/auth/sign-up" className="text-indigo-600 underline">/auth/sign-up</a></li>
              <li>Sign in and use the app</li>
              <li>Come back here and click "Refresh Data"</li>
            </ol>
            <p className="text-sm mt-3">
              <strong>Or check Firebase Console directly:</strong><br />
              <a 
                href="https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/users"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                View all users in Firebase Authentication →
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  All registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayUsers}</div>
                <p className="text-xs text-muted-foreground">
                  New users today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weekUsers}</div>
                <p className="text-xs text-muted-foreground">
                  New users this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeToday}</div>
                <p className="text-xs text-muted-foreground">
                  Active users today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Growth Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Growth (Last 30 Days)</CardTitle>
              <CardDescription>Daily new user registrations</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="New Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Total Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily New Users</CardTitle>
                <CardDescription>User registration trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={growthData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Registration statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">This Month</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.monthUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">This Week</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.weekUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Today</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.todayUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Active Today</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.activeToday}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Latest {recentUsers.length} registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm mt-1">Users will appear here when they sign up</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{getTimeSince(user.createdAt)}</TableCell>
                        <TableCell>
                          {user.lastActive ? getTimeSince(user.lastActive) : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.lastActive ? "default" : "secondary"}>
                            {user.lastActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Total entries across features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Feature usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-2xl font-bold text-indigo-600">{item.count}</span>
                    </div>
                  ))}
                  {activityData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No activity data yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

