/**
 * CampusSync - Dummy JSON Data Fallback
 * Used for static layout demonstration and offline fallback mode.
 */

export const DUMMY_DEPARTMENTS = [
    { id: 1, name: "Computer Science", short_code: "CS", color_hex: "#3B82F6" },
    { id: 2, name: "Engineering", short_code: "ENG", color_hex: "#10B981" },
    { id: 3, name: "Accounts & Finance", short_code: "ACC", color_hex: "#F59E0B" },
    { id: 4, name: "Information Technology", short_code: "IT", color_hex: "#8B5CF6" },
    { id: 5, name: "Deans Office", short_code: "DEAN", color_hex: "#EC4899" }
];

export const DUMMY_USERS = [
    { id: 1, name: "Dean Elena Miller", email: "emiller@university.edu", role: "Dean", department_id: 5, avatar_initials: "EM", department_name: "Deans Office", dept_code: "DEAN", dept_color: "#EC4899" },
    { id: 2, name: "Dr. Arthur Aris", email: "aaris@university.edu", role: "Dept Head", department_id: 1, avatar_initials: "AA", department_name: "Computer Science", dept_code: "CS", dept_color: "#3B82F6" },
    { id: 3, name: "Prof. Richard Davis", email: "rdavis@university.edu", role: "Professor", department_id: 1, avatar_initials: "RD", department_name: "Computer Science", dept_code: "CS", dept_color: "#3B82F6" },
    { id: 4, name: "Prof. Sarah Jenkins", email: "sjenkins@university.edu", role: "Professor", department_id: 2, avatar_initials: "SJ", department_name: "Engineering", dept_code: "ENG", dept_color: "#10B981" },
    { id: 5, name: "Marcus Vance", email: "mvance@university.edu", role: "IT", department_id: 4, avatar_initials: "MV", department_name: "Information Technology", dept_code: "IT", dept_color: "#8B5CF6" },
    { id: 6, name: "Clara Oswald", email: "coswald@university.edu", role: "Accounts", department_id: 3, avatar_initials: "CO", department_name: "Accounts & Finance", dept_code: "ACC", dept_color: "#F59E0B" }
];

export const DUMMY_COLUMNS = [
    { id: 1, board_id: 1, title: "Proposed Changes", position_order: 1 },
    { id: 2, board_id: 1, title: "Department Review", position_order: 2 },
    { id: 3, board_id: 1, title: "Dean Approval", position_order: 3 },
    { id: 4, board_id: 1, title: "Finalized", position_order: 4 }
];

export const DUMMY_TASKS = [
    {
        id: 1,
        column_id: 1,
        title: "CS101 Intro Syllabus Modernization",
        description: "Update curriculum to include AI ethics and modern Python tooling for introductory students. Requires review of prerequisite lab materials.",
        creator_id: 3,
        creator_name: "Prof. Richard Davis",
        creator_role: "Professor",
        creator_avatar: "RD",
        creator_dept_code: "CS",
        creator_dept_color: "#3B82F6",
        target_department_id: null,
        target_dept_code: null,
        target_dept_name: null,
        due_date: "2026-08-15",
        status: "Proposed",
        last_moved_by_name: "Prof. Richard Davis",
        created_at: "2026-07-20 09:00:00",
        comment_count: 2
    },
    {
        id: 2,
        column_id: 2,
        title: "Robotics Lab Equipment Upgrades",
        description: "Proposal for replacing legacy oscilloscopes and microcontroller kits in the robotics lab. Vendor quotes attached in documentation.",
        creator_id: 4,
        creator_name: "Prof. Sarah Jenkins",
        creator_role: "Professor",
        creator_avatar: "SJ",
        creator_dept_code: "ENG",
        creator_dept_color: "#10B981",
        target_department_id: null,
        target_dept_code: null,
        target_dept_name: null,
        due_date: "2026-08-20",
        status: "In Review",
        last_moved_by_name: "Dr. Arthur Aris",
        created_at: "2026-07-18 10:30:00",
        comment_count: 0
    },
    {
        id: 3,
        column_id: 2,
        title: "FY2026 Cloud Computing Budget Allocation",
        description: "Confidential budget request from IT Department specifically routed to Accounts & Finance for server clusters and GPU compute allocation.",
        creator_id: 5,
        creator_name: "Marcus Vance",
        creator_role: "IT",
        creator_avatar: "MV",
        creator_dept_code: "IT",
        creator_dept_color: "#8B5CF6",
        target_department_id: 3,
        target_dept_code: "ACC",
        target_dept_name: "Accounts & Finance",
        target_dept_color: "#F59E0B",
        due_date: "2026-08-10",
        status: "In Review",
        last_moved_by_name: "Marcus Vance",
        created_at: "2026-07-22 14:15:00",
        comment_count: 1
    },
    {
        id: 4,
        column_id: 3,
        title: "AI Research Lab Curriculum Integration",
        description: "Formal submission for establishing an undergraduate research track in generative AI systems across Computer Science and Engineering.",
        creator_id: 2,
        creator_name: "Dr. Arthur Aris",
        creator_role: "Dept Head",
        creator_avatar: "AA",
        creator_dept_code: "CS",
        creator_dept_color: "#3B82F6",
        target_department_id: null,
        target_dept_code: null,
        target_dept_name: null,
        due_date: "2026-08-30",
        status: "Dean Approval",
        last_moved_by_name: "Dr. Arthur Aris",
        created_at: "2026-07-15 11:20:00",
        comment_count: 1
    },
    {
        id: 5,
        column_id: 4,
        title: "Fall 2026 Exam Schedule Finalization",
        description: "Completed schedule coordination across CS and Engineering departments. Signed off by Dean's Office.",
        creator_id: 2,
        creator_name: "Dr. Arthur Aris",
        creator_role: "Dept Head",
        creator_avatar: "AA",
        creator_dept_code: "CS",
        creator_dept_color: "#3B82F6",
        target_department_id: null,
        target_dept_code: null,
        target_dept_name: null,
        due_date: "2026-07-28",
        status: "Finalized",
        last_moved_by_name: "Dean Elena Miller",
        created_at: "2026-07-10 08:00:00",
        comment_count: 0
    }
];

export const DUMMY_COMMENTS = [
    { id: 1, task_id: 1, user_id: 2, user_name: "Dr. Arthur Aris", user_role: "Dept Head", avatar_initials: "AA", dept_code: "CS", dept_color: "#3B82F6", text: "Looks great! Please ensure we include a section on LLM prompting principles.", timestamp: "2026-07-21 10:00:00" },
    { id: 2, task_id: 1, user_id: 3, user_name: "Prof. Richard Davis", user_role: "Professor", avatar_initials: "RD", dept_code: "CS", dept_color: "#3B82F6", text: "Updated the reading list to reflect the latest 2026 standards.", timestamp: "2026-07-22 09:30:00" },
    { id: 3, task_id: 3, user_id: 6, user_name: "Clara Oswald", user_role: "Accounts", avatar_initials: "CO", dept_code: "ACC", dept_color: "#F59E0B", text: "Accounts has reviewed the cloud compute line items. Will need Dean approval once verified.", timestamp: "2026-07-23 15:45:00" },
    { id: 4, task_id: 4, user_id: 1, user_name: "Dean Elena Miller", user_role: "Dean", avatar_initials: "EM", dept_code: "DEAN", dept_color: "#EC4899", text: "Pending final review of the lab room allocation before formal approval.", timestamp: "2026-07-25 14:00:00" }
];
