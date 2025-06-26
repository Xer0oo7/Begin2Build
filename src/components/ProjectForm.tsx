import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    projectName: '',
    repositoryLink: '',
    hostedLink: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, projectName, repositoryLink, hostedLink } = formData;
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }

    if (!projectName.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your project name.",
        variant: "destructive",
      });
      return false;
    }

    if (!repositoryLink.trim() || !isValidUrl(repositoryLink)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid repository URL.",
        variant: "destructive",
      });
      return false;
    }

    if (!hostedLink.trim() || !isValidUrl(hostedLink)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid hosted URL.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '205e46a8-229d-4117-98d9-a9ccbc2156eb',
          name: formData.name,
          subject: `New Begin2Build Project Submission: ${formData.projectName}`,
          message: `
            Name: ${formData.name}
            Project Name: ${formData.projectName}
            Repository Link: ${formData.repositoryLink}
            Hosted Link: ${formData.hostedLink}
            Feedback: ${formData.feedback || "No feedback provided"}
          `,
          from_name: "Begin2Build Submissions",
          to_email: "begin2build@gmail.com"
        }),
      });

      if (response.ok) {
        // Send data to SheetBest Google Sheets API
        const sheetResponse = await fetch('https://api.sheetbest.com/sheets/b655e981-9d97-42b2-8207-ad253a134622', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',

            'X-Api-Key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            "Name": formData.name,
            "Project Name": formData.projectName,
            "Repository Link": formData.repositoryLink,
            "Hosted Link": formData.hostedLink,
            "Feedback": formData.feedback,
          }),
        });

        if (!sheetResponse.ok) {
          throw new Error('SheetBest submission failed');
        }

        setIsSubmitted(true);
        toast({
          title: "Success!",
          description: "✅ Thank you for submitting your project!",
        });

        setFormData({
          name: '',
          projectName: '',
          repositoryLink: '',
          hostedLink: '',
          feedback: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 if (isSubmitted) {
  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-12 shadow-lg">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-cream mb-4">Project Submitted Successfully!</h2>
        <p className="text-cream/80 mb-8 text-lg">
          Thank you for sharing your amazing work with us. We're excited to see what you've built!
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button className="bg-cream text-charcoal hover:bg-cream-dark transition-all duration-300 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 shadow-lg">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-cream font-medium">
              Your Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="bg-cream/5 border-cream/20 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/20 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-cream font-medium">
              Project Name *
            </Label>
            <Input
              id="projectName"
              name="projectName"
              type="text"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="What did you build?"
              className="bg-cream/5 border-cream/20 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/20 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repositoryLink" className="text-cream font-medium">
              Repository Link *
            </Label>
            <Input
              id="repositoryLink"
              name="repositoryLink"
              type="url"
              value={formData.repositoryLink}
              onChange={handleInputChange}
              placeholder="https://github.com/yourusername/your-project"
              className="bg-cream/5 border-cream/20 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/20 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostedLink" className="text-cream font-medium">
              Hosted Link *
            </Label>
            <Input
              id="hostedLink"
              name="hostedLink"
              type="url"
              value={formData.hostedLink}
              onChange={handleInputChange}
              placeholder="https://your-project.vercel.app"
              className="bg-cream/5 border-cream/20 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/20 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-cream font-medium">
              Feedback on B2B Sessions
            </Label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Share your experience or suggestions (optional)"
              className="bg-cream/5 border border-cream/20 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/20 transition-all duration-300 rounded-lg p-3 w-full resize-none"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-cream text-charcoal hover:bg-cream-dark transition-all duration-300 font-semibold py-3 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-charcoal border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;

