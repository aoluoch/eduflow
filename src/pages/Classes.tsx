import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { grades, subjects, students, getStudentsByGradeId } from '@/data/mockData';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface GradeWithDetails {
  id: string;
  name: string;
  level: string;
  capacity: number;
  assignedSubjects: string[];
}

const Classes = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectsDialogOpen, setSubjectsDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeWithDetails | null>(null);

  // Mock data with capacities and assigned subjects
  const [gradesWithDetails, setGradesWithDetails] = useState<GradeWithDetails[]>(
    grades.map(g => ({
      ...g,
      capacity: 40,
      assignedSubjects: subjects.slice(0, 6).map(s => s.id),
    }))
  );

  const [formData, setFormData] = useState({
    name: '',
    level: '',
    capacity: 40,
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleCreate = () => {
    toast.success(`Grade "${formData.name}" created successfully!`);
    setCreateDialogOpen(false);
    setFormData({ name: '', level: '', capacity: 40 });
  };

  const handleEdit = () => {
    if (selectedGrade) {
      toast.success(`Grade "${selectedGrade.name}" updated successfully!`);
      setEditDialogOpen(false);
      setSelectedGrade(null);
    }
  };

  const handleDelete = () => {
    if (selectedGrade) {
      toast.success(`Grade "${selectedGrade.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setSelectedGrade(null);
    }
  };

  const openEditDialog = (grade: GradeWithDetails) => {
    setSelectedGrade(grade);
    setFormData({
      name: grade.name,
      level: grade.level,
      capacity: grade.capacity,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (grade: GradeWithDetails) => {
    setSelectedGrade(grade);
    setDeleteDialogOpen(true);
  };

  const openSubjectsDialog = (grade: GradeWithDetails) => {
    setSelectedGrade(grade);
    setSelectedSubjects(grade.assignedSubjects);
    setSubjectsDialogOpen(true);
  };

  const handleSaveSubjects = () => {
    if (selectedGrade) {
      toast.success(`Subjects updated for ${selectedGrade.name}!`);
      setSubjectsDialogOpen(false);
      setSelectedGrade(null);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classes & Grades Management</h1>
            <p className="text-muted-foreground mt-1">Manage grades, subjects, and class capacities</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Grade</DialogTitle>
                <DialogDescription>
                  Add a new grade/class to the school system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="grade-name">Grade Name</Label>
                  <Input
                    id="grade-name"
                    placeholder="e.g., Grade 4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    placeholder="e.g., Upper Primary"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Class Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="40"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of students</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Grade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Grades</p>
                <p className="text-3xl font-bold text-foreground">{gradesWithDetails.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Subjects</p>
                <p className="text-3xl font-bold text-foreground">{subjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Grades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradesWithDetails.map((grade) => {
            const studentCount = getStudentsByGradeId(grade.id).length;
            const capacityPercentage = ((studentCount / grade.capacity) * 100).toFixed(0);
            const isNearCapacity = studentCount / grade.capacity > 0.8;

            return (
              <Card key={grade.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{grade.name}</h3>
                      <p className="text-sm text-muted-foreground">{grade.level}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(grade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteDialog(grade)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students Enrolled</span>
                      <span className={`font-semibold ${isNearCapacity ? 'text-warning' : 'text-foreground'}`}>
                        {studentCount} / {grade.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isNearCapacity ? 'bg-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(parseInt(capacityPercentage), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Assigned Subjects</span>
                      <Badge variant="secondary">{grade.assignedSubjects.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {grade.assignedSubjects.slice(0, 4).map(subjectId => {
                        const subject = subjects.find(s => s.id === subjectId);
                        return (
                          <Badge key={subjectId} variant="outline" className="text-xs">
                            {subject?.code}
                          </Badge>
                        );
                      })}
                      {grade.assignedSubjects.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{grade.assignedSubjects.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => openSubjectsDialog(grade)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Subjects
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Grade</DialogTitle>
              <DialogDescription>
                Update grade information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-grade-name">Grade Name</Label>
                <Input
                  id="edit-grade-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Input
                  id="edit-level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Class Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Grade</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedGrade?.name}"? This action cannot be undone.
                {selectedGrade && getStudentsByGradeId(selectedGrade.id).length > 0 && (
                  <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <p className="text-destructive font-medium">
                      Warning: This grade has {getStudentsByGradeId(selectedGrade.id).length} enrolled students.
                      You must reassign them before deletion.
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Grade
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Subjects Assignment Dialog */}
        <Dialog open={subjectsDialogOpen} onOpenChange={setSubjectsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Subjects - {selectedGrade?.name}</DialogTitle>
              <DialogDescription>
                Select subjects to be taught in this grade
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <Checkbox
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => toggleSubject(subject.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">
                  Selected: {selectedSubjects.length} of {subjects.length} subjects
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSubjectsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSubjects}>
                Save Subject Assignments
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
