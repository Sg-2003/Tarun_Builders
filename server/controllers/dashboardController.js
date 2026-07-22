const Project = require('../models/Project');
const Contact = require('../models/Contact');
const News = require('../models/News');
const Tender = require('../models/Tender');
const Career = require('../models/Career');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const [totalProjects, completedProjects, runningProjects, upcomingProjects,
      totalContacts, unreadContacts, activeTenders, publishedNews,
      totalUsers, activeJobs] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Completed' }),
      Project.countDocuments({ status: 'Running' }),
      Project.countDocuments({ status: 'Upcoming' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Tender.countDocuments({ status: 'Active' }),
      News.countDocuments({ isPublished: true }),
      User.countDocuments({ isActive: true }),
      Career.countDocuments({ isActive: true }),
    ]);

    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5).select('title status category location');
    const recentNews = await News.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select('title category createdAt');

    res.json({
      success: true,
      data: {
        stats: { totalProjects, completedProjects, runningProjects, upcomingProjects, totalContacts, unreadContacts, activeTenders, publishedNews, totalUsers, activeJobs },
        recentContacts,
        recentProjects,
        recentNews,
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getDashboardStats };
