const { 
    getCompanies, 
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany 
} = require('./controllers/Companies');
const { 
    getCandidates, 
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate
} = require('./controllers/Candidates');
const {
    getJobById,
    getJobs,
    createJob,
    updateJob,
    deleteJob
} = require('./controllers/Jobs');
const {
    getBountyById,
    getBounties,
    createBounty,
    updateBounty,
    deleteBounty
} = require('./controllers/Bounties');
const { signUp, signIn, authenticateToken } = require('./controllers/Auth');

const router = require("express").Router();

// companies
router.get("/api/companies", getCompanies);
router.get("/api/companies/:companyId", getCompanyById);
router.post("/api/companies", createCompany);
router.patch("/api/companies/:companyId", updateCompany);
router.delete("/api/companies/:companyId", deleteCompany);

// candidates
router.get("/api/candidates", getCandidates);
router.get("/api/candidates/:candidateId", getCandidateById);
router.post("/api/candidates/:candidateId", createCandidate);
router.patch("/api/candidates/:candidateId", updateCandidate);
router.delete("/api/candidates/:candidateId", deleteCandidate);

// jobs
router.get("/api/jobs", getJobs);
router.get("/api/jobs/:jobId", getJobById);
router.post("/api/jobs/:jobId", createJob);
router.patch("/api/jobs/:jobId", updateJob);
router.delete("/api/jobs/:jobId", deleteJob);

// bounties
router.get("/api/bounties", getBounties);
router.get("/api/bounties/:bountyId", getBountyById);
router.post("/api/bounties/:bountyId", createBounty);
router.patch("/api/bounties/:bountyId", updateBounty);
router.delete("/api/bounties/:bountyId", deleteBounty);

// auth
router.post("/api/auth/signUp", signUp);
router.post("/api/auth/signIn", signIn);

module.exports = router;