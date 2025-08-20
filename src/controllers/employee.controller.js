import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import { PEOPLE_API } from "../config/config.js";

dotenv.config();

export async function getEmployee(req, res) {
  const accessToken = req.accessToken || "";
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
  try {
    const { email } = req.query;
    const result = await axios.get(
      `${PEOPLE_API}/forms/P_EmployeeView/records?searchColumn=EMPLOYEEMAILALIAS&searchValue=${email}`,
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    const job = await axios.get(
        `${PEOPLE_API}/timetracker/getjobs?assignedTo=${email}`,
        { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    const empData = result.data?.[0];

    if (!empData) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }

    const employee = {
      firstName: empData["First Name"] || "",
      lastName: empData["Last Name"] || "",
      email: empData["Email address"] || "",
      employeeId: empData["Employee ID"] || "",
      userId: empData["recordId"] || "",
      status: empData["Employee Status"] || "",
      designation: empData["Designation"] || null,
      department: empData["Department"] || null,
      photo: empData["Photo_downloadUrl"] || null,
    };

    const jobs =
      job.data?.response?.result?.map(j => ({
        projectName: j.projectName,
        jobName: j.jobName,
        jobId: j.jobId,
        jobStatus: j.jobStatus,
        clientName: j.clientName,
        clientId: j.clientId,
      })) || [];

    res.send({
      success: true,
      data: employee,
      jobs,
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
}

export async function getJobs(req, res) {
  const accessToken = req.accessToken || "";
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
  try {
    const { email } = req.query;
    const result = await axios.get(
        `${PEOPLE_API}/timetracker/getjobs?assignedTo=${email}`,
        { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    res.send({
      success: true,
      data: result.data
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
};

export async function createTimeLog(req, res) {
  const accessToken = req.accessToken || "";
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
  try {
    const result = await axios.post(
        `${PEOPLE_API}/timetracker/addtimelog`,
        qs.stringify(req.body),
        {
        headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        }
    );
    res.send({
        success: true,
        message: "Time log created successfully",
        data: result.data
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
};

export async function getTimeSheet(req, res) {
    const accessToken = req.accessToken || "";
    if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
    try {
        const {user, fromDate, toDate} = req.query
        const result = await axios.get(
            `${PEOPLE_API}/timetracker/gettimesheet`,
            { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }, params: { user, fromDate, toDate } }
        );
        res.send({
            success: true,
            data: result.data
        });
    } catch (err) {
        res.status(500).send(err.response?.data || err.message);
    }
};

export async function createTimeSheet(req, res) {
  const accessToken = req.accessToken || "";
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
  try {
    const result = await axios.post(
        `${PEOPLE_API}/timetracker/createtimesheet`,
        qs.stringify(req.body),
        {
        headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        }
    );
    res.send({
        success: true,
        message: "TimeSheet created successfully",
        data: result.data
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
};

export async function updateTimeSheet(req, res) {
  const accessToken = req.accessToken || "";
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
  try {
    const result = await axios.post(
        `${PEOPLE_API}/timetracker/modifytimesheet`,
        qs.stringify(req.body),
        {
        headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        }
    );
    res.send({
        success: true,
        message: "TimeSheet updated successfully",
        data: result.data
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
};

export async function updateTimeSheetStatus(req, res) {
    const accessToken = req.accessToken || "";
    if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");
    try {
        const result = await axios.post(
            `${PEOPLE_API}/timetracker/approvetimesheet`,
            qs.stringify(req.body),
            {
            headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
            }
        );
        res.send({
        success: true,
        message: "TimeSheet approved successfully",
        data: result.data
        });
    } catch (err) {
        res.status(500).send(err.response?.data || err.message);
    }
}



