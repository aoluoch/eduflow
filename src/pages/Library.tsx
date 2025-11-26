import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { books, grades, subjects } from '@/data/mockData';
import { BookOpen, Upload, Search, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/utils/roleContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const Library = () => {
  const { currentRole } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canUpload = currentRole === 'super-admin' || currentRole === 'admin';

  const handleUpload = () => {
    toast.success('Book uploaded successfully!');
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Digital Library</h1>
            <p className="text-muted-foreground mt-1">Browse and access school resources</p>
          </div>
          {canUpload && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Book</DialogTitle>
                  <DialogDescription>
                    Add a new book to the library
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Book title" />
                  <Input placeholder="Author" />
                  <Input placeholder="Description" />
                  <div className="text-sm text-muted-foreground">
                    (Mock file upload interface)
                  </div>
                </div>
                <Button onClick={handleUpload}>Upload</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const grade = book.gradeId ? grades.find(g => g.id === book.gradeId) : null;
              const subject = book.subjectId ? subjects.find(s => s.id === book.subjectId) : null;

              return (
                <Card key={book.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{book.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  <div className="flex gap-2 mb-3">
                    {grade && <Badge variant="outline">{grade.name}</Badge>}
                    {subject && <Badge variant="secondary">{subject.code}</Badge>}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={() => setSelectedBook(book)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </Card>
              );
            })}
          </div>
        </Card>

        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBook?.title}</DialogTitle>
              <DialogDescription>
                by {selectedBook?.author}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="h-32 w-32 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedBook?.description}
              </p>
              <div className="flex gap-2 mb-4">
                {selectedBook?.gradeId && (
                  <Badge variant="outline">
                    {grades.find(g => g.id === selectedBook.gradeId)?.name}
                  </Badge>
                )}
                {selectedBook?.subjectId && (
                  <Badge variant="secondary">
                    {subjects.find(s => s.id === selectedBook.subjectId)?.name}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Uploaded: {selectedBook && new Date(selectedBook.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Download PDF</Button>
              <Button variant="outline" className="flex-1">Read Online</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Library;
