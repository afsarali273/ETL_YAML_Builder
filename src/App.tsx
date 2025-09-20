import { useState, useEffect } from "react";
import type { JobConfig, Validation } from "./types";
import { toYaml, fromYaml } from "./utils/yamlUtils";
import JobMetadataForm from "./components/JobMetadataForm";
import SourceTargetForm from "./components/SourceTargetForm";
import ValidationBuilder from "./components/ValidationBuilder";
import YamlPreview from "./components/YamlPreview";
import YamlEditor from "./components/YamlEditor";
import { Tab, Tabs, Box, Button, ThemeProvider, createTheme, CssBaseline, Paper, Typography } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        background: {
            default: '#0f172a',
            paper: '#ffffff',
        },
        success: {
            main: '#06d6a0',
        },
        warning: {
            main: '#ffd60a',
        },
        error: {
            main: '#ef476f',
        },
    },
    typography: {
        fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
        h4: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
                            transform: 'translateY(-1px)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1), 0 8px 32px rgba(59, 130, 246, 0.2)',
                            transform: 'translateY(-2px)',
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
                    padding: '14px 28px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    },
                },
                contained: {
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(16px)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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

export default function App() {
    const [job, setJob] = useState<JobConfig>(defaultJob);
    const [tab, setTab] = useState(0);
    const [editorText, setEditorText] = useState<string>(() => toYaml(defaultJob));
    const [yamlError, setYamlError] = useState<string | null>(null);

    // sync form -> editor
    useEffect(() => {
        setEditorText(toYaml(job));
    }, [job]);

    function applyYamlToForm() {
        try {
            const parsed = fromYaml(editorText);
            // Optionally validate parsed shape here
            setJob(parsed as JobConfig);
            setYamlError(null);
        } catch (err: any) {
            setYamlError(err.message || "YAML parse error");
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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', 
                minHeight: '100vh', 
                py: 4, 
                px: 4,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }
            }}>
                    <Paper elevation={0} sx={{ 
                        mb: 4, 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}>
                        <Tabs 
                            value={tab} 
                            onChange={(_, val) => setTab(val)}
                            sx={{ 
                                '& .MuiTab-root': { 
                                    minHeight: 60,
                                    fontSize: '1.1rem'
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
                            <SourceTargetForm value={job} onChange={(val) => setJob(val)} />
                            <ValidationBuilder
                                validations={job.validations}
                                onAdd={addValidation}
                                onUpdate={updateValidation}
                                onRemove={removeValidation}
                            />
                            <Box display="flex" gap={2} justifyContent="center" mt={4}>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => {
                                        const blob = new Blob([toYaml(job)], { type: "text/yaml" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url; a.download = `${job.job_name || "job"}.yml`; a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #06d6a0 0%, #059669 100%)',
                                        color: 'white',
                                        boxShadow: '0 8px 32px rgba(6, 214, 160, 0.4), 0 0 20px rgba(6, 214, 160, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': { 
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            boxShadow: '0 12px 40px rgba(6, 214, 160, 0.5), 0 0 30px rgba(6, 214, 160, 0.3)',
                                            transform: 'translateY(-3px)',
                                        }
                                    }}
                                >
                                    💾 Download YAML
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => setTab(1)}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                        color: 'white',
                                        boxShadow: '0 8px 32px rgba(30, 41, 59, 0.4), 0 0 20px rgba(30, 41, 59, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': { 
                                            background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                                            boxShadow: '0 12px 40px rgba(30, 41, 59, 0.5), 0 0 30px rgba(30, 41, 59, 0.3)',
                                            transform: 'translateY(-3px)',
                                        }
                                    }}
                                >
                                    📄 Preview YAML
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => setTab(2)}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: 'white',
                                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': { 
                                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
                                            transform: 'translateY(-3px)',
                                        }
                                    }}
                                >
                                    ✏️ Edit YAML
                                </Button>
                            </Box>
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
            </Box>
        </ThemeProvider>
    );
}
