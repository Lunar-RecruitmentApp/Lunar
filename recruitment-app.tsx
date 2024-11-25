import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

type CVReviewResult = {
  name: string;
  experience: string;
  skills: string;
  qualifications: string;
  status: string;
};

type Vacancy = {
  id: number;
  title: string;
  description: string;
  closingDate: string;
  contact: string;
  candidates: CVReviewResult[];
  isClosed: boolean;
};

export default function RecruitmentApp() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [cvResults, setCvResults] = useState<CVReviewResult[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [newVacancy, setNewVacancy] = useState({
    title: "",
    description: "",
    closingDate: "",
    contact: "",
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleVacancyCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setVacancies([
      ...vacancies,
      {
        id: vacancies.length + 1,
        title: newVacancy.title,
        description: newVacancy.description,
        closingDate: newVacancy.closingDate,
        contact: newVacancy.contact,
        candidates: [],
        isClosed: false,
      },
    ]);
    setNewVacancy({ title: "", description: "", closingDate: "", contact: "" });
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newCandidates = Array.from(e.target.files).map((file) => ({
        name: file.name.replace(/\.[^/.]+$/, ""),
        experience: `${Math.floor(Math.random() * 10 + 1)} years`,
        skills: "Communication, Teamwork, Problem-Solving",
        qualifications: "Bachelor's Degree",
        status: "Pending Review",
      }));
      setCvResults([...cvResults, ...newCandidates]);
    }
  };

  const processCVs = (vacancyId?: number) => {
    if (vacancyId) {
      setVacancies((prevVacancies) =>
        prevVacancies.map((vacancy) =>
          vacancy.id === vacancyId
            ? {
                ...vacancy,
                candidates: vacancy.candidates.map((cv, index) => ({
                  ...cv,
                  status:
                    index < Math.floor(vacancy.candidates.length * 0.2)
                      ? "Shortlisted"
                      : "Rejected",
                })),
              }
            : vacancy
        )
      );
    } else {
      setCvResults((prevResults) =>
        prevResults.map((cv, index) => ({
          ...cv,
          status:
            index < Math.floor(prevResults.length * 0.2) ? "Shortlisted" : "Rejected",
        }))
      );
    }
  };

  const closeVacancy = (vacancyId: number) => {
    setVacancies((prevVacancies) =>
      prevVacancies.map((vacancy) =>
        vacancy.id === vacancyId ? { ...vacancy, isClosed: true } : vacancy
      )
    );
  };

  const getEligibleVacancies = () => {
    return vacancies.filter((vacancy) => !vacancy.isClosed);
  };

  return (
    <div className="p-4">
      <div className={`bg-[#3663A8] p-4 mb-8 ${isMobile ? 'text-center' : ''}`}>
        <div className={`container mx-auto ${isMobile ? 'flex flex-col' : 'flex'} items-center gap-4`}>
          <div className="bg-[#3663A8] rounded-full p-1">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Asset%203-KXOpy039Fyv9VFWTBeWK9wW5kLxk55.png"
              alt="Lunar Logo"
              className="h-16 w-16 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F4B331]">Lunar</h1>
            <p className="text-[#F4B331]">Recruitment Assistant</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className={`bg-[#3663A8] ${isMobile ? 'flex flex-wrap' : ''}`}>
          <TabsTrigger 
            value="dashboard" 
            className="text-[#F4B331] data-[state=active]:text-white data-[state=active]:bg-[#3663A8]/80"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="vacancies" 
            className="text-[#F4B331] data-[state=active]:text-white data-[state=active]:bg-[#3663A8]/80"
          >
            Vacancies
          </TabsTrigger>
          <TabsTrigger 
            value="candidates" 
            className="text-[#F4B331] data-[state=active]:text-white data-[state=active]:bg-[#3663A8]/80"
          >
            Candidates
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="text-[#F4B331] data-[state=active]:text-white data-[state=active]:bg-[#3663A8]/80"
          >
            History
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Current Vacancies</CardTitle>
              <CardDescription>
                Review results of active vacancies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vacancies
                .filter((v) => !v.isClosed)
                .map((vacancy) => (
                  <div key={vacancy.id} className="mb-4">
                    <h3 className="font-bold text-lg">{vacancy.title}</h3>
                    <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
                      <table className="w-full border-collapse border border-gray-200 mt-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Name</th>
                            <th className="border border-gray-300 p-2 text-left">Experience</th>
                            <th className="border border-gray-300 p-2 text-left">Skills</th>
                            <th className="border border-gray-300 p-2 text-left">Qualifications</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vacancy.candidates.map((cv, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">{cv.name}</td>
                              <td className="border border-gray-300 p-2">{cv.experience}</td>
                              <td className="border border-gray-300 p-2">{cv.skills}</td>
                              <td className="border border-gray-300 p-2">{cv.qualifications}</td>
                              <td className="border border-gray-300 p-2">{cv.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={`mt-4 ${isMobile ? 'flex flex-col' : 'flex'} gap-2`}>
                      <Button
                        className="bg-[#3663A8] hover:bg-[#3663A8]/90 text-[#F4B331]"
                        onClick={() => processCVs(vacancy.id)}
                      >
                        Process CVs
                      </Button>
                      <Button
                        className="bg-[#3663A8] hover:bg-[#3663A8]/90 text-[#F4B331]"
                        onClick={() => closeVacancy(vacancy.id)}
                      >
                        Close Vacancy
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vacancies */}
        <TabsContent value="vacancies">
          <Card>
            <CardHeader>
              <CardTitle>Manage Vacancies</CardTitle>
              <CardDescription>
                Create new job openings or view active vacancies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleVacancyCreate}>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newVacancy.title}
                    onChange={(e) =>
                      setNewVacancy({ ...newVacancy, title: e.target.value })
                    }
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <textarea
                    id="description"
                    value={newVacancy.description}
                    onChange={(e) =>
                      setNewVacancy({ ...newVacancy, description: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter job description"
                    rows={4}
                  ></textarea>
                </div>
                <div>
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={newVacancy.closingDate}
                    onChange={(e) =>
                      setNewVacancy({ ...newVacancy, closingDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Details</Label>
                  <Input
                    id="contact"
                    value={newVacancy.contact}
                    onChange={(e) =>
                      setNewVacancy({ ...newVacancy, contact: e.target.value })
                    }
                    placeholder="Enter contact details"
                  />
                </div>
                <Button type="submit" className="bg-[#3663A8] hover:bg-[#3663A8]/90 text-[#F4B331] w-full">Create Vacancy</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidates */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Management</CardTitle>
              <CardDescription>Upload and process CVs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vacancySelect">Select Vacancy</Label>
                  <select
                    id="vacancySelect"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setSelectedVacancy(Number(e.target.value))}
                    value={selectedVacancy ?? ""}
                  >
                    <option value="" disabled>
                      -- Select a Vacancy --
                    </option>
                    {getEligibleVacancies().map((vacancy) => (
                      <option key={vacancy.id} value={vacancy.id}>
                        {vacancy.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="cvUpload">Upload CVs</Label>
                  <Input
                    id="cvUpload"
                    type="file"
                    multiple
                    onChange={handleCVUpload}
                    disabled={!selectedVacancy}
                  />
                </div>
                <Button onClick={processCVs} disabled={!selectedVacancy} className="bg-[#3663A8] hover:bg-[#3663A8]/90 text-[#F4B331] w-full">
                  Process CVs
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p>
                Selected Vacancy:{" "}
                {vacancies.find((v) => v.id === selectedVacancy)?.title || "None"}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>
                Overview of closed job openings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vacancies.filter((v) => v.isClosed).map((vacancy) => (
                <div key={vacancy.id} className="mb-4">
                  <h3 className="font-semibold">{vacancy.title}</h3>
                  <p>Total Applicants: {vacancy.candidates.length}</p>
                  <p>
                    Accepted:{" "}
                    {
                      vacancy.candidates.filter((cv) => cv.status === "Shortlisted")
                        .length
                    }
                  </p>
                  <p>
                    Rejected:{" "}
                    {
                      vacancy.candidates.filter((cv) => cv.status === "Rejected")
                        .length
                    }
                  </p>
                  <details>
                    <summary>Detailed Results</summary>
                    <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
                      <table className="w-full border-collapse border border-gray-200 mt-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Name</th>
                            <th className="border border-gray-300 p-2 text-left">Experience</th>
                            <th className="border border-gray-300 p-2 text-left">Skills</th>
                            <th className="border border-gray-300 p-2 text-left">Qualifications</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vacancy.candidates.map((cv, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">{cv.name}</td>
                              <td className="border border-gray-300 p-2">{cv.experience}</td>
                              <td className="border border-gray-300 p-2">{cv.skills}</td>
                              <td className="border border-gray-300 p-2">{cv.qualifications}</td>
                              <td className="border border-gray-300 p-2">{cv.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}