import { useState, useEffect } from "react";
import type { JobConfig, Validation, DatabaseConfig } from "./types";
import { toYaml, fromYaml } from "./utils/yamlUtils";
import JobMetadataForm from "./components/JobMetadataForm";
import SourceTargetForm from "./components/SourceTargetForm";
import ValidationBuilder from "./components/ValidationBuilder";
import YamlPreview from "./components/YamlPreview";
import YamlEditor from "./components/YamlEditor";
import SettingsModal from "./components/SettingsModal";
import { Tab, Tabs, Box, Button, ThemeProvider, createTheme, CssBaseline, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1',
            light: '#a5b4fc',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#06b6d4',
            light: '#67e8f9',
            dark: '#0891b2',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        success: {
            main: '#10b981',
            light: '#6ee7b7',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
    },
    typography: {
        fontFamily: '"Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
        h4: {
            fontWeight: 700,
            color: '#1f2937',
            letterSpacing: '-0.025em',
        },
        h5: {
            fontWeight: 700,
            color: '#1f2937',
            letterSpacing: '-0.025em',
        },
        h6: {
            fontWeight: 600,
            color: '#374151',
            letterSpacing: '-0.025em',
        },
        body1: {
            color: '#4b5563',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: '#d1d5db',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                        '&.Mui-focused': {
                            borderColor: '#6366f1',
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#6b7280',
                        '&.Mui-focused': {
                            color: '#6366f1',
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '12px 24px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    },
                },
                contained: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    '&.Mui-selected': {
                        color: '#6366f1',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#6366f1',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f3f4f6',
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: 8,
                },
                colorPrimary: {
                    backgroundColor: '#ede9fe',
                    color: '#6366f1',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#d1d5db',
                    '&.Mui-checked': {
                        color: '#6366f1',
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: '#d1d5db',
                    '&.Mui-checked': {
                        color: '#6366f1',
                    },
                },
            },
        },
    },
});

const defaultJob: JobConfig = {
    job_name: "TC0001-DMP",
    description: "ETL job to validate and load customer data from source to target",
    owner: "Mohammed Afsar",
    source: { type: "mssql", dbServer: "", table: "", database: "", schema: "" },
    target: { type: "mssql", dbServer: "", table: "", database: "", schema: "" },
    validations: []
};

const STORAGE_KEY = 'etl_database_configs';

export default function App() {
    const [job, setJob] = useState<JobConfig>(defaultJob);
    const [tab, setTab] = useState(0);
    const [editorText, setEditorText] = useState<string>(() => toYaml(defaultJob));
    const [yamlError, setYamlError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [databases, setDatabases] = useState<DatabaseConfig[]>(() => {
        // Load from session storage on init
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // sync form -> editor
    useEffect(() => {
        setEditorText(toYaml(job));
    }, [job]);

    // Save databases to session storage whenever they change
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(databases));
        } catch (err) {
            console.error('Failed to save to session storage:', err);
        }
    }, [databases]);

    function applyYamlToForm() {
        try {
            const parsed = fromYaml(editorText);
            // Optionally validate parsed shape here
            setJob(parsed as JobConfig);
            setYamlError(null);
        } catch (err: unknown) {
            setYamlError(err instanceof Error ? err.message : "YAML parse error");
        }
    }

    function updateValidation(index: number, v: Validation) {
        const copy = [...job.validations];
        copy[index] = v;
        setJob({ ...job, validations: copy });
    }
    function addValidation(v: Validation) {
        setJob({ ...job, validations: [...job.validations, v] });
    }
    function removeValidation(index: number) {
        const copy = job.validations.filter((_, i) => i !== index);
        setJob({ ...job, validations: copy });
    }

    function handleSaveDatabases(newDatabases: DatabaseConfig[]) {
        setDatabases(newDatabases);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                minHeight: '100vh', 
                py: 6, 
                px: 4,
            }}>
                <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                    {/* Header with Settings Icon */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                ETL YAML Builder
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Configure and generate YAML files for ETL pipelines
                            </Typography>
                        </Box>
                        <Tooltip title="Database Configuration Settings">
                            <IconButton
                                onClick={() => setSettingsOpen(true)}
                                sx={{
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6',
                                        transform: 'rotate(90deg)',
                                    },
                                    transition: 'all 0.3s ease',
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                <SettingsIcon sx={{ fontSize: 28, color: '#6366f1' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Paper elevation={1} sx={{ mb: 4, backgroundColor: '#ffffff' }}>
                        <Tabs 
                            value={tab} 
                            onChange={(_, val) => setTab(val)}
                            sx={{ 
                                '& .MuiTab-root': { 
                                    minHeight: 60,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }
                            }}
                        >
                            <Tab label="🛠️ Form Builder" />
                            <Tab label="📜 YAML Preview" />
                            <Tab label="✏️ YAML Editor" />
                        </Tabs>
                    </Paper>

                    {tab === 0 && (
                        <Box>
                            <JobMetadataForm value={job} onChange={(val) => setJob(val)} />
                            <SourceTargetForm value={job} onChange={(val) => setJob(val)} databases={databases} />
                            <ValidationBuilder
                                validations={job.validations}
                                onAdd={addValidation}
                                onUpdate={updateValidation}
                                onRemove={removeValidation}
                            />

                            {/* Enhanced Action Buttons */}
                            <Paper
                                elevation={0}
                                sx={{
                                    mt: 4,
                                    p: 4,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: 3,
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'white',
                                        mb: 3,
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    🚀 Ready to Export?
                                </Typography>
                                <Box
                                    display="flex"
                                    gap={2}
                                    justifyContent="center"
                                    flexWrap="wrap"
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#667eea',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            '&:hover': {
                                                backgroundColor: '#f3f4f6',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                                            }
                                        }}
                                        onClick={() => {
                                            const blob = new Blob([toYaml(job)], { type: "text/yaml" });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url; a.download = `${job.job_name || "job"}.yml`; a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        💾 Download YAML
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: 'white',
                                            color: 'white',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                        onClick={() => setTab(1)}
                                    >
                                        📄 Preview YAML
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: 'white',
                                            color: 'white',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                        onClick={() => setTab(2)}
                                    >
                                        ✏️ Edit YAML
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box>
                            <YamlPreview data={job} />
                            <Box mt={3}>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
                                    }}
                                    onClick={() => {
                                        const blob = new Blob([toYaml(job)], { type: "text/yaml" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url; a.download = `${job.job_name || "job"}.yml`; a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    💾 Download YAML
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {tab === 2 && (
                        <Paper elevation={0} sx={{ p: 3, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                                ✏️ YAML Editor
                            </Typography>
                            <YamlEditor text={editorText} onChange={setEditorText} />
                            <Box mt={3}>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    sx={{ 
                                        backgroundColor: 'white', 
                                        color: '#6366f1',
                                        '&:hover': { backgroundColor: '#f3f4f6' }
                                    }}
                                    onClick={applyYamlToForm}
                                >
                                    ⚙️ Apply YAML to Form
                                </Button>
                                {yamlError && <Box color="#fca5a5" mt={2} p={2} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2 }}>{yamlError}</Box>}
                            </Box>
                        </Paper>
                    )}

                    {/* Settings Modal */}
                    <SettingsModal
                        open={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        databases={databases}
                        onSave={handleSaveDatabases}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
