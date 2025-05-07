import { Attachment } from "./attachment";
import AttachmentModel from "../model/attachment";
import { Queryable, Transactionable } from "../foundation/database";
import { PoolConnection } from "mysql2/promise";

describe("Attachment Repository", () => {
  let attachmentRepo: Attachment;

  const databaseMock: jest.Mocked<Queryable & Transactionable> = {
    transaction: jest.fn(),
    withConnection: jest.fn(),
    withTransaction: jest.fn(),
  };

  const tx: jest.Mocked<Partial<PoolConnection>> = {
    query: jest.fn().mockResolvedValue(undefined),
  };

  const now = Date.now();

  const mockAttachmentData = {
    id: "attachment-1",
    post_id: "post-1",
    name: "image.png",
    original_name: "original-image.png",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  beforeEach(() => {
    attachmentRepo = new Attachment(databaseMock);
    attachmentRepo["database"] = {
      withConnection: jest.fn(),
      withTransaction: jest.fn(),
    };
  });

  it("should return attachments by post ID", async () => {
    (
      attachmentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[mockAttachmentData]]),
      });
    });

    const attachments = await attachmentRepo.selectByPostId("post-1");
    expect(attachments.length).toBe(1);
    expect(attachments[0]).toBeInstanceOf(AttachmentModel);
    expect(attachments[0].getId()).toBe("attachment-1");
  });

  it("should return empty array if no attachments found", async () => {
    (
      attachmentRepo["database"].withConnection as jest.Mock
    ).mockImplementationOnce(async (callback: any) => {
      return await callback({
        query: jest.fn().mockResolvedValue([[]]),
      });
    });

    const attachments = await attachmentRepo.selectByPostId("post-999");
    expect(attachments).toEqual([]);
  });

  it("should insert batch of attachments in transaction", async () => {
    const attachment = new AttachmentModel(mockAttachmentData);

    await expect(
      attachmentRepo.insertBatchTx(
        tx as unknown as jest.Mocked<PoolConnection>,
        [attachment]
      )
    ).resolves.toBeUndefined();
  });

  it("should delete attachments by post ID in transaction", async () => {
    await expect(
      attachmentRepo.deleteByPostIdTx(
        tx as unknown as jest.Mocked<PoolConnection>,
        "post-1"
      )
    ).resolves.toBeUndefined();
  });
});
