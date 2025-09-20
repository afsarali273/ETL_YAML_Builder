import { toYaml } from "../utils/yamlUtils";
import { Paper, Typography, Box } from "@mui/material";

export default function YamlPreview({ data }: { data: any }) {
    return (
        <Paper elevation={0} sx={{ p: 3, background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                📜 YAML Preview
            </Typography>
            <Box 
                component="pre" 
                sx={{ 
                    background: '#0f172a', 
                    color: '#e2e8f0', 
                    p: 3, 
                    borderRadius: 3, 
                    maxHeight: 500, 
                    overflow: 'auto',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    border: '1px solid #334155'
                }}
            >
                {toYaml(data)}
            </Box>
        </Paper>
    );
}
