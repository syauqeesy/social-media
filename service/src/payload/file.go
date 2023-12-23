package payload

type FileInfo struct {
	OriginalName string `json:"original_name"`
	MimeType     string `json:"mime_type"`
	Url          string `json:"url"`
}

type FileRequest struct {
	OriginalName string `json:"original_name"`
	File         string `json:"file"`
}
