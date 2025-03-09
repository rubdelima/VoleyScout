import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function LabTabs(props: LabTabsProps) {
	const { itemOne } = props;

	const [value, setValue] = React.useState("1");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%", typography: "body1" }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList onChange={handleChange} aria-label="lab API tabs example">
						<Tab label="Item One" value="1" />
						<Tab label="Item Two" value="2" />
						<Tab label="Item Three" value="3" />
					</TabList>
				</Box>
				<TabPanel value="1">{itemOne}</TabPanel>
				<TabPanel value="2">Item Two</TabPanel>
				<TabPanel value="3">Item Three</TabPanel>
			</TabContext>
		</Box>
	);
}

interface LabTabsProps {
	//children?: React.ReactNode;
	//dir?: string;
	//index: number;
	//value: number;
	itemOne: string;
}

export default LabTabs;
