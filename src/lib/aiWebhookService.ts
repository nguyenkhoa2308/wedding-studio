/* eslint-disable @typescript-eslint/no-explicit-any */
// AI Webhook Service for generating note summaries
// This service simulates calling an AI API to generate summaries of contract notes

interface NoteHistoryItem {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  type: "note" | "action" | "contract";
  source: "crm" | "contract";
}

interface AIWebhookResponse {
  success: boolean;
  summary: string;
  timestamp: string;
  processedNotes: number;
}

// Mock AI responses for different scenarios
const mockAIResponses = [
  "Khách hàng tiềm năng từ {source}, quan tâm gói {package}. Đã có tương tác tích cực và sẵn sàng ký hợp đồng. Cần theo dõi tiến độ thanh toán và chuẩn bị buổi chụp.",
  "Lead chất lượng cao với ngân sách phù hợp. Đã thảo luận chi tiết về yêu cầu và xác nhận package {package}. Timeline rõ ràng, khả năng hoàn thành tốt.",
  "Khách hàng có yêu cầu đặc biệt về phong cách và địa điểm. Đã confirm chi tiết kỹ thuật và thời gian. Cần chuẩn bị kỹ lưỡng để đảm bảo chất lượng dịch vụ.",
  "Tương tác tích cực từ khách hàng, đã thể hiện sự quan tâm nghiêm túc. Package {package} phù hợp với ngân sách và nhu cầu. Tiến hành ký hợp đồng và setup timeline.",
  "Khách hàng VIP với yêu cầu cao về chất lượng. Đã thảo luận chi tiết về deliverables và timeline. Cần đặc biệt chú ý đến từng khâu để đảm bảo sự hài lòng.",
];

// Simulate AI processing delay
const simulateProcessingDelay = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 2000 + 1000); // 1-3 seconds delay
  });
};

// Generate contextual summary based on notes
const generateContextualSummary = (
  noteHistory: NoteHistoryItem[],
  contractInfo: {
    couple: string;
    package: string;
    source: string;
    totalAmount: number;
  },
  userNote?: string
): string => {
  const noteCount = noteHistory.length;
  const hasSpecialRequests =
    noteHistory.some(
      (note) =>
        note.content.toLowerCase().includes("yêu cầu") ||
        note.content.toLowerCase().includes("đặc biệt") ||
        note.content.toLowerCase().includes("vip")
    ) ||
    (userNote &&
      (userNote.toLowerCase().includes("yêu cầu") ||
        userNote.toLowerCase().includes("đặc biệt") ||
        userNote.toLowerCase().includes("vip")));

  const hasPositiveInteraction =
    noteHistory.some(
      (note) =>
        note.content.toLowerCase().includes("đồng ý") ||
        note.content.toLowerCase().includes("hài lòng") ||
        note.content.toLowerCase().includes("tích cực")
    ) ||
    (userNote &&
      (userNote.toLowerCase().includes("đồng ý") ||
        userNote.toLowerCase().includes("hài lòng") ||
        userNote.toLowerCase().includes("tích cực")));

  let baseTemplate;

  // If we have no notes at all, create a basic contract summary
  if (noteCount === 0 && (!userNote || !userNote.trim())) {
    baseTemplate = `Hợp đồng {package} từ nguồn {source}. Khách hàng mới được chuyển từ CRM sang hệ thống hợp đồng. Cần theo dõi tiến độ thanh toán và lập kế hoạch thực hiện dịch vụ.`;
  } else if (hasSpecialRequests) {
    baseTemplate = mockAIResponses[2];
  } else if (hasPositiveInteraction) {
    baseTemplate = mockAIResponses[3];
  } else if (contractInfo.totalAmount >= 50000000) {
    baseTemplate = mockAIResponses[4];
  } else if (noteCount >= 3) {
    baseTemplate = mockAIResponses[1];
  } else {
    baseTemplate = mockAIResponses[0];
  }

  // Replace placeholders with actual data
  let summary = baseTemplate
    .replace("{source}", contractInfo.source)
    .replace("{package}", contractInfo.package)
    .replace(/\{package\}/g, contractInfo.package); // Replace all occurrences

  // If user provided additional note, append it
  if (userNote && userNote.trim()) {
    summary += ` Ghi chú bổ sung: ${userNote.trim()}`;
  }

  return summary;
};

// Main AI webhook function
export async function callAIWebhookForSummary(
  contractId: number,
  noteHistory: NoteHistoryItem[],
  contractInfo: {
    couple: string;
    package: string;
    source: string;
    totalAmount: number;
    contractNumber: string;
  },
  userNote?: string
): Promise<AIWebhookResponse> {
  console.log(
    `🤖 AI Webhook: Bắt đầu tạo tóm tắt cho hợp đồng ${contractInfo.contractNumber}`
  );
  console.log(`📊 Dữ liệu đầu vào:`, {
    contractNumber: contractInfo.contractNumber,
    couple: contractInfo.couple,
    notesCount: noteHistory.length,
    package: contractInfo.package,
    source: contractInfo.source,
    totalAmount: contractInfo.totalAmount,
    hasUserNote: !!(userNote && userNote.trim()),
    userNote: userNote,
  });

  try {
    // Simulate API processing time
    await simulateProcessingDelay();

    // Generate contextual summary with user note
    const summary = generateContextualSummary(
      noteHistory,
      contractInfo,
      userNote
    );

    const response: AIWebhookResponse = {
      success: true,
      summary: summary,
      timestamp: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      processedNotes: noteHistory.length,
    };

    console.log(
      `✅ AI Webhook: Hoàn thành tóm tắt cho ${contractInfo.contractNumber}`
    );
    console.log(`📝 Tóm tắt được tạo:`, summary);
    console.log(`⏱️ Thời gian xử lý: ${response.timestamp}`);
    console.log(`📋 Số ghi chú đã xử lý: ${response.processedNotes}`);

    return response;
  } catch (error) {
    console.error(
      `❌ AI Webhook: Lỗi khi tạo tóm tắt cho ${contractInfo.contractNumber}:`,
      error
    );

    return {
      success: false,
      summary: "Không thể tạo tóm tắt tự động. Vui lòng thêm ghi chú thủ công.",
      timestamp: new Date().toLocaleString("vi-VN"),
      processedNotes: 0,
    };
  }
}

// Function to update contract with AI summary
export async function updateContractWithAISummary(
  contract: any,
  updateCallback: (contractId: number, updates: any) => void
): Promise<void> {
  console.log(
    `🔄 Bắt đầu cập nhật tóm tắt AI cho hợp đồng ${contract.contractNumber}`
  );

  try {
    // Set status to processing
    updateCallback(contract.id, {
      aiSummaryStatus: "processing",
    });

    const aiResponse = await callAIWebhookForSummary(
      contract.id,
      contract.noteHistory || [],
      {
        couple: contract.couple,
        package: contract.package,
        source: contract.source,
        totalAmount: contract.totalAmount,
        contractNumber: contract.contractNumber,
      },
      contract.note // Pass existing user note to AI
    );

    if (aiResponse.success) {
      // Update contract note with AI summary and mark as completed
      updateCallback(contract.id, {
        note: aiResponse.summary,
        aiSummaryStatus: "completed",
        aiSummaryGeneratedAt: aiResponse.timestamp,
      });

      console.log(
        `✅ Đã cập nhật tóm tắt AI cho hợp đồng ${contract.contractNumber}`
      );
    } else {
      // Mark as failed if AI couldn't generate summary
      updateCallback(contract.id, {
        aiSummaryStatus: "failed",
      });
      console.warn(
        `⚠️ AI không thể tạo tóm tắt cho hợp đồng ${contract.contractNumber}`
      );
    }
  } catch (error) {
    // Mark as failed on error
    updateCallback(contract.id, {
      aiSummaryStatus: "failed",
    });
    console.error(
      `❌ Lỗi khi cập nhật tóm tắt AI cho hợp đồng ${contract.contractNumber}:`,
      error
    );
  }
}

// Export types for use in other components
export type { AIWebhookResponse, NoteHistoryItem };
