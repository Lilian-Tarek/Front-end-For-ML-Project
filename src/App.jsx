import { useState } from "react";
import axios from "axios";
import jobTitles  from './Jobs.json'


export default function App() {
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [gender, setGender] = useState("Male");
  const [jobSearch, setJobSearch] = useState("");
  const [job, setJob] = useState("");
  const [education, setEducation] = useState("");
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [showDropdown, setShowDropdown] = useState(false);

  const filteredJobs = jobTitles.filter((j) =>
    j.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSalary(null);
    try {
      const response = await axios.post(
        "https://ml-model-for-university-cz77uw.fly.dev/predict",
        {
          age: Number(age),
          gender: gender,
          yearsOfExperience: Number(experience),
          jobTitle: job,
          educationLevel: education
        }
      );
      setSalary(response.data.salary);
    } catch (err) {
      setError("Failed to get prediction. Check API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Salary Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Years of Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border p-2 rounded"
          >
           
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        
          <div className="relative">
            <input
              placeholder="Search job title..."
              value={jobSearch}
              onChange={(e) => {
                setJobSearch(e.target.value);
                setShowDropdown(true); 
            
              }}
              onFocus={() => setShowDropdown(true)} 
              className="w-full border p-2 rounded"
            />

            {showDropdown && jobSearch && (
              <div className="absolute z-10 w-full border max-h-40 overflow-y-auto rounded bg-white shadow-lg mt-1">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((j, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setJob(j); 
                        setJobSearch(j); 
                        setShowDropdown(false); 
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                    >
                      {j}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-sm">No jobs found</div>
                )}
              </div>
            )}

          </div>

          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="High School">High School</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
          </select>

          <button
            type="submit"
            disabled={!job || loading} 
            className="w-full bg-black text-white p-2 rounded hover:opacity-90 disabled:bg-gray-400"
          >
            {loading ? "Predicting..." : "Predict Salary"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {salary && (
          <div className="mt-6 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-gray-600 text-sm uppercase tracking-wider">
              Predicted Salary
            </h2>
            <p className="text-3xl font-extrabold text-blue-900">
              ${Number(salary)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}