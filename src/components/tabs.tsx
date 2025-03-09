import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function LabTabs(props: LabTabsProps) {
	const { titleOne, titleTwo, contentOne, contentTwo } = props;

	const [value, setValue] = React.useState("1");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%", typography: "body1" }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList onChange={handleChange} aria-label="lab API tabs example">
						<Tab
							className="body-large-bold"
							sx={{ textTransform: "none" }}
							label={titleOne}
							value="1"
						/>
						<Tab
							className="body-large-bold"
							sx={{ textTransform: "none" }}
							label={titleTwo}
							value="2"
						/>
					</TabList>
				</Box>
				<TabPanel value="1">{contentOne}</TabPanel>
				<TabPanel value="2">{contentTwo}</TabPanel>
			</TabContext>
		</Box>
	);
}

interface LabTabsProps {
	titleOne: string;
	titleTwo: string;
	contentOne: any;
	contentTwo: any;
}

export default LabTabs;
