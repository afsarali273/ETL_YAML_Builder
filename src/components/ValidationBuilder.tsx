import type { Validation } from "../types";
import { Box, TextField, Select, MenuItem, IconButton, Paper, Typography, Chip, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, FormLabel } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function defaultValidationFor(type: string): Validation {
    switch(type) {
        case "row_count": return { type: "row_count", name: "Row Count Match", enabled: true, tolerance: 0.01 };
        case "row_compare": return { type: "row_compare", name: "Row Compare Validation", enabled: true, key_columns: ["ACCTAH"], compare_columns: [] , ignore_case:true, trim_whitespace:true, null_equals_blank:false, allow_duplicate_keys:false, log_duplicates:true, max_mismatches:100, stop_on_first_mismatch:false, exclude_columns:[], include_only_columns:[] };
        case "column_count": return { type: "column_count", name: "Column Count match", enabled: true, targetCount: 18 };
        case "null_check": return { type: "null_check", name: "Null Check - Target", enabled: true, columns: ["ACCTAH"], threshold: 0, fail_on_any:false, scope:"target" };
        case "col_value_check": return { type: "col_value_check", name: "Value Check - Target", enabled: true, columns: ["ACCTAH"], expected_col_value: "123" };
        case "duplicate_check": return { type: "duplicate_check", name: "Duplicate Check - Customer Table", enabled: true, columns: ["ACCTAH","LVDTAH"], group_by: ["region"], threshold:0, fail_on_any:true, scope:"target", ignore_case:true, trim_whitespace:true };
        default: throw new Error("unknown");
    }
}

export default function ValidationBuilder({ validations, onAdd, onUpdate, onRemove }:
                                          { validations: Validation[]; onAdd: (v: Validation) => void; onUpdate: (i:number,v:Validation)=>void; onRemove: (i:number)=>void }) {

    return (
        <Paper elevation={0} sx={{ 
            mt: 3, 
            p: 4, 
            background: 'rgba(255, 214, 10, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 214, 10, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(255, 214, 10, 0.25)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #ffd60a, transparent)',
            }
        }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                ⚙️ Data Validations
            </Typography>
            <Box display="flex" gap={2} mb={3}>
                <Select 
                    onChange={(e)=> onAdd(defaultValidationFor(e.target.value as string))} 
                    value="" 
                    displayEmpty
                    sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: 2 }}
                >
                    <MenuItem value="" disabled>Add validation…</MenuItem>
                    <MenuItem value="row_count">📊 Row Count</MenuItem>
                    <MenuItem value="row_compare">🔄 Row Compare</MenuItem>
                    <MenuItem value="column_count">📋 Column Count</MenuItem>
                    <MenuItem value="null_check">⚠️ Null Check</MenuItem>
                    <MenuItem value="col_value_check">🔍 Value Check</MenuItem>
                    <MenuItem value="duplicate_check">🔁 Duplicate Check</MenuItem>
                </Select>
            </Box>

            {validations.map((v, idx) => (
                <Paper key={idx} elevation={0} sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
                    }
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Chip label={v.type} color="primary" size="small" />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>{v.name}</Typography>
                        </Box>
                        <IconButton onClick={()=>onRemove(idx)} sx={{ color: '#ef4444' }}><DeleteIcon/></IconButton>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        {/* Common fields */}
                        <TextField fullWidth label="Name" value={(v as any).name || ""} onChange={(e)=> onUpdate(idx, {...v, name: e.target.value} as Validation)} />
                        
                        <FormControlLabel 
                            control={<Checkbox checked={(v as any).enabled ?? true} onChange={(e)=> onUpdate(idx, {...v, enabled: e.target.checked} as Validation)} />}
                            label="Enabled"
                        />

                        {/* Row Count Validation */}
                        {v.type === "row_count" && (
                            <TextField 
                                label="Tolerance (0-1)" 
                                type="number" 
                                inputProps={{ min: 0, max: 1, step: 0.01 }}
                                value={(v as any).tolerance ?? ""} 
                                onChange={(e)=> onUpdate(idx, {...v, tolerance: parseFloat(e.target.value)} as Validation)} 
                            />
                        )}

                        {/* Row Compare Validation */}
                        {v.type === "row_compare" && (
                            <>
                                <TextField 
                                    label="Key columns (comma separated)" 
                                    value={(v as any).key_columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, key_columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                />
                                <TextField 
                                    label="Compare columns (comma separated, empty=all)" 
                                    value={(v as any).compare_columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, compare_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                />
                                <TextField 
                                    label="Exclude columns (comma separated)" 
                                    value={(v as any).exclude_columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, exclude_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                />
                                <TextField 
                                    label="Include only columns (comma separated)" 
                                    value={(v as any).include_only_columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, include_only_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                />
                                <TextField 
                                    label="Max mismatches" 
                                    type="number" 
                                    value={(v as any).max_mismatches ?? ""} 
                                    onChange={(e)=> onUpdate(idx, {...v, max_mismatches: parseInt(e.target.value)} as Validation)} 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).ignore_case ?? true} onChange={(e)=> onUpdate(idx, {...v, ignore_case: e.target.checked} as Validation)} />}
                                    label="Ignore case"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).trim_whitespace ?? true} onChange={(e)=> onUpdate(idx, {...v, trim_whitespace: e.target.checked} as Validation)} />}
                                    label="Trim whitespace"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).null_equals_blank ?? false} onChange={(e)=> onUpdate(idx, {...v, null_equals_blank: e.target.checked} as Validation)} />}
                                    label="Null equals blank"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).allow_duplicate_keys ?? false} onChange={(e)=> onUpdate(idx, {...v, allow_duplicate_keys: e.target.checked} as Validation)} />}
                                    label="Allow duplicate keys"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).log_duplicates ?? true} onChange={(e)=> onUpdate(idx, {...v, log_duplicates: e.target.checked} as Validation)} />}
                                    label="Log duplicates"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).stop_on_first_mismatch ?? false} onChange={(e)=> onUpdate(idx, {...v, stop_on_first_mismatch: e.target.checked} as Validation)} />}
                                    label="Stop on first mismatch"
                                />
                            </>
                        )}

                        {/* Column Count Validation */}
                        {v.type === "column_count" && (
                            <TextField 
                                label="Target Count" 
                                type="number" 
                                value={(v as any).targetCount ?? ""} 
                                onChange={(e)=> onUpdate(idx, {...v, targetCount: parseInt(e.target.value)} as Validation)} 
                            />
                        )}

                        {/* Null Check Validation */}
                        {v.type === "null_check" && (
                            <>
                                <TextField 
                                    label="Columns (comma separated)" 
                                    value={(v as any).columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                />
                                <TextField 
                                    label="Threshold" 
                                    type="number" 
                                    value={(v as any).threshold ?? ""} 
                                    onChange={(e)=> onUpdate(idx, {...v, threshold: parseInt(e.target.value)} as Validation)} 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).fail_on_any ?? false} onChange={(e)=> onUpdate(idx, {...v, fail_on_any: e.target.checked} as Validation)} />}
                                    label="Fail on any"
                                />
                                <FormControl>
                                    <FormLabel>Scope</FormLabel>
                                    <RadioGroup 
                                        value={(v as any).scope || "target"} 
                                        onChange={(e)=> onUpdate(idx, {...v, scope: e.target.value} as Validation)}
                                        row
                                    >
                                        <FormControlLabel value="source" control={<Radio />} label="Source" />
                                        <FormControlLabel value="target" control={<Radio />} label="Target" />
                                    </RadioGroup>
                                </FormControl>
                            </>
                        )}

                        {/* Column Value Check Validation */}
                        {v.type === "col_value_check" && (
                            <>
                                <TextField 
                                    label="Columns (comma separated)" 
                                    value={(v as any).columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                />
                                <TextField 
                                    label="Expected column value" 
                                    value={(v as any).expected_col_value || ""} 
                                    onChange={(e)=> onUpdate(idx, {...v, expected_col_value: e.target.value} as Validation)} 
                                />
                            </>
                        )}

                        {/* Duplicate Check Validation */}
                        {v.type === "duplicate_check" && (
                            <>
                                <TextField 
                                    label="Columns (comma separated)" 
                                    value={(v as any).columns?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                />
                                <TextField 
                                    label="Group by (comma separated)" 
                                    value={(v as any).group_by?.join(",")||""} 
                                    onChange={(e)=> onUpdate(idx, {...v, group_by: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                />
                                <TextField 
                                    label="Threshold" 
                                    type="number" 
                                    value={(v as any).threshold ?? ""} 
                                    onChange={(e)=> onUpdate(idx, {...v, threshold: parseInt(e.target.value)} as Validation)} 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).fail_on_any ?? true} onChange={(e)=> onUpdate(idx, {...v, fail_on_any: e.target.checked} as Validation)} />}
                                    label="Fail on any"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).ignore_case ?? true} onChange={(e)=> onUpdate(idx, {...v, ignore_case: e.target.checked} as Validation)} />}
                                    label="Ignore case"
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={(v as any).trim_whitespace ?? true} onChange={(e)=> onUpdate(idx, {...v, trim_whitespace: e.target.checked} as Validation)} />}
                                    label="Trim whitespace"
                                />
                                <FormControl>
                                    <FormLabel>Scope</FormLabel>
                                    <RadioGroup 
                                        value={(v as any).scope || "target"} 
                                        onChange={(e)=> onUpdate(idx, {...v, scope: e.target.value} as Validation)}
                                        row
                                    >
                                        <FormControlLabel value="source" control={<Radio />} label="Source" />
                                        <FormControlLabel value="target" control={<Radio />} label="Target" />
                                    </RadioGroup>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </Paper>
            ))}
        </Paper>
    );
}
