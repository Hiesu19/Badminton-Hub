import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

const StatCard = ({ label, value, detail }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: '1px solid #e5f0e6',
      height: '100%',
    }}
  >
    <CardContent>
      <Typography variant="subtitle2" sx={{ color: '#475467', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value ?? '—'}
      </Typography>
      {detail && (
        <Typography variant="body2" sx={{ color: '#475467', mt: 0.5 }}>
          {detail}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function DashboardStatTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e5f0e6',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {(tabs[activeTab]?.cards ?? []).map((card) => (
            <Grid key={card.label} item xs={12} md={6}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

