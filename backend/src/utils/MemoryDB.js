const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../db.json');

class MemoryDB {
  static data = null;

  static init() {
    if (this.data) return;
    try {
      if (fs.existsSync(DB_FILE)) {
        this.data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      } else {
        this.data = {
          courses: [], students: [], mentors: [], batches: [],
          batchPlanner: [], batchSessions: [], studyMaterials: [],
          sessionFeedback: [], courseRatings: [], blogs: [],
          reviews: [], faqs: [], schedules: [], recordings: [],
          assignments: [], payments: [], doubts: [], notifications: [],
          events: [], leads: [], serverEnquiries: [],
          websiteContent: {
            heroTitle: "Master SAP With Real-Time Scenarios",
            heroSubtitle: "Premium Live Training by Industry Experts.",
            contactEmail: "info@srivihaansap.com",
            contactPhone: "+91 98765 43210"
          }
        };
        this.save();
      }
    } catch (err) {
      console.error('Error initializing MemoryDB:', err);
    }
  }

  static save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('Error saving MemoryDB:', err);
    }
  }

  static get(collection) {
    this.init();
    return this.data[collection] || [];
  }

  static set(collection, items) {
    this.init();
    this.data[collection] = items;
    this.save();
  }
}

module.exports = MemoryDB;
